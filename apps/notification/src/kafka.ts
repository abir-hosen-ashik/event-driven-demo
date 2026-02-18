import { Kafka } from "kafkajs";

export async function startConsumer() {
  const kafka = new Kafka({ brokers: ["localhost:9092"] });
  const consumer = kafka.consumer({ groupId: "notification-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "user-loggedin" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Notify:", message.value?.toString());
    },
  });

  console.log("Kafka consumer running...");
}
