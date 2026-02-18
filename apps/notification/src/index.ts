import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { start } from "./rabbit";
import { startConsumer } from "./kafka";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

// 🔥 IMPORTANT
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

start();
startConsumer()