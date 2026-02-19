import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { authClient } from "./grpc-client";

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
  const { email, password } = req.body;


  const response = await axios.post(
    "http://localhost:4001/login",
    req.body
  );

  // res.json(response.data);
  console.log(response.data);

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

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
