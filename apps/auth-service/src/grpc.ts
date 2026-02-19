import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const protoPath = path.join(
  require.resolve("@repo/types/package.json"),
  "../protos/auth.proto"
);

const packageDef = protoLoader.loadSync(protoPath);

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const authPackage = grpcObject.auth; // if your proto has: package auth;

const server = new grpc.Server();

server.addService(authPackage.AuthService.service, {
  ValidateToken: (call: any, callback: any) => {
    callback(null, { valid: true });
  },
  Login: (call: any, callback: any) => {
    const { email } = call.request;

    console.log("Login:", email);

    callback(null, {
      message: "Login success",
      token: "fake-jwt-token",
    });
  },
});

server.bindAsync(
  "0.0.0.0:7001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC running on 7001");
    server.start();
  }
);
