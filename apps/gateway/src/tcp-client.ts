import net from "net";

export function loginViaTCP(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(9001, "localhost", () => {
      client.write(JSON.stringify({ type: "login", ...data }));
    });

    client.on("data", (data) => {
      resolve(JSON.parse(data.toString()));
      client.destroy();
    });

    client.on("error", (err) => {
      reject(err);
    });
  });
}
