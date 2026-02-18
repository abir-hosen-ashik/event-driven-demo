import net from "net";

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("Received:", data.toString());
    socket.write("Auth Response");
  });
});

server.listen(5001, () => {
  console.log("TCP Auth running 5001");
});
