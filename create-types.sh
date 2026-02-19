#!/bin/bash
# create-types.sh
# Run from root of Turbo monorepo

PACKAGE_DIR="./packages/types"

echo "Creating TypeScript shared types package at $PACKAGE_DIR..."

# 1️⃣ create folder structure
mkdir -p $PACKAGE_DIR/src
mkdir -p $PACKAGE_DIR/protos

# 2️⃣ create package.json
cat > $PACKAGE_DIR/package.json <<EOL
{
  "name": "@repo/types",
  "version": "1.0.0",
  "description": "Shared gRPC protos and TypeScript types for microservices",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "protos"],
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev src/index.ts"
  },
  "keywords": ["grpc", "typescript", "shared-types"],
  "author": "Abir Hosen",
  "license": "ISC",
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "5.9.2"
  }
}
EOL

# 3️⃣ create tsconfig.json
cat > $PACKAGE_DIR/tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src", "protos"]
}
EOL

# 4️⃣ create src/index.ts
cat > $PACKAGE_DIR/src/index.ts <<EOL
// Central export for shared types
console.log("Shared types package ready");

// Example placeholder
export interface TokenRequest {
  token: string;
}

export interface TokenResponse {
  valid: boolean;
}
EOL

# 5️⃣ create a sample proto file
cat > $PACKAGE_DIR/protos/auth.proto <<EOL
syntax = "proto3";

package auth;

service AuthService {
  rpc ValidateToken(TokenRequest) returns (TokenResponse);
}

message TokenRequest {
  string token = 1;
}

message TokenResponse {
  bool valid = 1;
}
EOL

# 6️⃣ install dev dependencies with pnpm
echo "Installing devDependencies..."
pnpm install -F $PACKAGE_DIR

echo "✅ types project created successfully at $PACKAGE_DIR"
