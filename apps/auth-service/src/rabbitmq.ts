import amqp from "amqplib";

async function initRabbit() {
    const conn = await amqp.connect("amqp://localhost");
  }

