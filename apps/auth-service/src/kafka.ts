import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const producer = kafka.producer();

export async function sendUserLoggedInEvent(email: string) {
  await producer.connect();

  await producer.send({
    topic: "user-loggedin",
    messages: [{ value: JSON.stringify({ email }) }],
  });

  console.log(`Sent user-loggedin event for ${email}`);
}
