import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { authClient } from "./grpc-client";
import { loginViaTCP } from "./tcp-client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8001;

// 🔥 IMPORTANT
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Forward to Auth Service (HTTP)
app.post("/login", async (req: Request, res: Response) => {
  console.log("Body:", req.body);

  const response = await axios.post(
    "http://localhost:4001/login",
    req.body
  );
  res.json(response.data);
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
