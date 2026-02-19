import express, { Express, Request, Response } from "express";
import {
  ConsecutiveBreaker,
  ExponentialBackoff,
  retry,
  handleAll,
  circuitBreaker,
  wrap,
} from 'cockatiel';
import dotenv from "dotenv";
import axios from "axios";
import { authClient } from "./grpc-client";
import { loginViaTCP } from "./tcp-client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8001;

// 🔥 IMPORTANT
app.use(express.json());


// Create a retry policy that'll try whatever function we execute 3
// times with a randomized exponential backoff.
const retryPolicy = retry(handleAll, { maxAttempts: 3, backoff: new ExponentialBackoff() });

// Create a circuit breaker that'll stop calling the executed function for 10
// seconds if it fails 5 times in a row. This can give time for e.g. a database
// to recover without getting tons of traffic.
const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10 * 1000,
  breaker: new ConsecutiveBreaker(5),
});

// Combine these! Create a policy that retries 3 times, calling through the circuit breaker
const retryWithBreaker = wrap(retryPolicy, circuitBreakerPolicy);

circuitBreakerPolicy.onBreak(() => console.log("🔴 Circuit opened!"));
circuitBreakerPolicy.onHalfOpen(() => console.log("🟡 Circuit half-open, testing..."));
circuitBreakerPolicy.onReset(() => console.log("🟢 Circuit closed again"));


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Forward to Auth Service (HTTP)
app.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("Body:", req.body);

    const response = await retryWithBreaker.execute(() =>  axios.post(
      "http://localhost:4001/login",
      req.body
    ));
    res.json(response.data);
  }
  catch(e) {
    res.json("Error")
  }
});

app.post("/login-grpc", async (req, res) => {
  try {
    const { email, password } = req.body;

    authClient.Login(
      { email, password },
      (err: any, response: any) => {
        if (err) {
          console.error("gRPC Error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json(response);
      }
    );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login-tcp", async (req, res) => {
  try {
    const response = await loginViaTCP(req.body);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
