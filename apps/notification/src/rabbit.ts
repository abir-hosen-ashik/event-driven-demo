import amqp from "amqplib";

export async function start() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  await channel.assertQueue("user.loggedin");

  channel.consume("user.loggedin", (msg) => {
    if (msg) {
      const user = JSON.parse(msg.content.toString());
      console.log("Send email to:", user.email, user);
      channel.ack(msg);
    }
  });
}


