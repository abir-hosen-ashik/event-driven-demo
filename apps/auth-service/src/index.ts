import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import amqp from "amqplib";
import { sendUserLoggedInEvent } from "./kafka";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4001;

// 🔥 IMPORTANT
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/login", async (req, res) => {
  // business logic
  const user = { id: 1, email: req?.body?.email??'' };

  // Publish event
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  await channel.assertQueue("user.loggedin");
  channel.sendToQueue("user.loggedin", Buffer.from(JSON.stringify(user)));
  await sendUserLoggedInEvent(user.email)

  res.json({ token: "jwt-token" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
