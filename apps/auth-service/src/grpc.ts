import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import amqp from "amqplib";
import { sendUserLoggedInEvent } from "./kafka";
import path from "path";

const protoPath = path.join(
  require.resolve("@repo/types/package.json"),
  "../protos/auth.proto"
);

const packageDef = protoLoader.loadSync(protoPath);
const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const authPackage = grpcObject.auth;

const server = new grpc.Server();

/* 🔥 Create RabbitMQ connection ONCE */
let channel: amqp.Channel;

async function initRabbit() {
  const conn = await amqp.connect("amqp://localhost");
  channel = await conn.createChannel();
  await channel.assertQueue("user.loggedin");
  console.log("RabbitMQ connected");
}

server.addService(authPackage.AuthService.service, {
  ValidateToken: async (call: any, callback: any) => {
    callback(null, { valid: true });
  },

  Login: async (call: any, callback: any) => {
    try {
      const { email } = call.request;

      console.log("Login:", email);

      const user = { email };

      /* 🐰 Publish RabbitMQ */
      channel.sendToQueue(
        "user.loggedin",
        Buffer.from(JSON.stringify(user))
      );

      /* 📨 Publish Kafka */
      await sendUserLoggedInEvent(email);

      callback(null, {
        message: "Login success",
        token: "fake-jwt-token",
      });
    } catch (err: any) {
      console.error("Login error:", err);
      callback({
        code: grpc.status.INTERNAL,
        message: "Login failed",
      });
    }
  },
});

async function start() {
  await initRabbit();

  server.bindAsync(
    "0.0.0.0:7001",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC running on 7001");
      server.start();
    }
  );
}

start();
