import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
