import net from "net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      console.log("Received:", parsed);

      if (parsed.type === "login") {
        socket.write(
          JSON.stringify({
            status: "success",
            token: "tcp-fake-jwt",
          })
        );
      } else {
        socket.write(
          JSON.stringify({ status: "error", message: "Unknown action" })
        );
      }
    } catch (err) {
      socket.write(
        JSON.stringify({ status: "error", message: "Invalid JSON" })
      );
    }
  });
});

server.listen(9001, () => {
  console.log("TCP Auth running on 9001");
});
