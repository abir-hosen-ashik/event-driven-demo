import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const protoPath = path.join(
  require.resolve("@repo/types/package.json"),
  "../protos/auth.proto"
);

const packageDef = protoLoader.loadSync(protoPath);

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const authPackage = grpcObject.auth;

export const authClient = new authPackage.AuthService(
  "localhost:7001",
  grpc.credentials.createInsecure()
);
