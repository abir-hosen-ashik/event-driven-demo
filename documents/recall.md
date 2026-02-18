pnpm dlx create-turbo@latest .

select pnpm


---

`pnpm-workspace.yaml` মানে এটি একটি **monorepo config file** (pnpm এর জন্য)।

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

এর মানে:

* `apps/*` → `apps` ফোল্ডারের ভেতরের সব সাবফোল্ডার আলাদা আলাদা package/project হিসেবে ধরা হবে
* `packages/*` → `packages` ফোল্ডারের ভেতরের সব সাবফোল্ডারও package হিসেবে ধরা হবে

অর্থাৎ pnpm বুঝবে এগুলো সব একই workspace এর অংশ এবং তারা একে অপরকে local dependency হিসেবে ব্যবহার করতে পারবে।

---

এই Warning মানে হলো **Turbo cache/pipeline জানে না কোথায় build output যাবে**।

### Cause

* `turbo.json` এর `outputs` সঠিকভাবে define করা হয়নি।
* Turbo cache দেখতে চায় “এই task কি ফাইল/ফোল্ডার generate করে”।

### Fix

1. `turbo.json` এ প্রতিটি app এর build output path define করো। উদাহরণ:

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "outputs": ["dist/**"]
    }
  }
}
```

* যদি আলাদা app থাকে:

```json
{
  "pipeline": {
    "auth-service#build": { "outputs": ["apps/auth-service/dist/**"] },
    "gateway#build": { "outputs": ["apps/gateway/dist/**"] },
    "notification#build": { "outputs": ["apps/notification-service/dist/**"] }
  }
}
```

2. Build command এ output folder match করতে হবে। উদাহরণ:

```json
// apps/auth-service/package.json
"scripts": {
  "build": "tsc -p tsconfig.build.json"
}
```

* `tsconfig.build.json` তে `outDir: "dist"` set আছে কি check করো।

💡 Turbo warning gone হবে যদি **task output folder ঠিকভাবে declare** করা থাকে।


---


Add dependency to a specific project

```bash
pnpm add _ --filter ./apps/api
```


Add dependency at root, as it is common

```bash
pnpm add express axios dotenv -w
pnpm add -D typescript ts-node-dev @types/express -w
pnpm add @grpc/grpc-js @grpc/proto-loader -w
pnpm add amqplib kafkajs -w
```



`-w` মানে **--workspace-root**

অর্থাৎ dependency সরাসরি **monorepo root package.json** এ যোগ হবে।

উদাহরণ:

```bash
pnpm add express -w
```

👉 এটা root এ install করবে, কোনো নির্দিষ্ট `apps/*` বা `packages/*` এ না।


---


```bash
npx create-express-ts ./apps/gateway
npx create-express-ts ./apps/auth-service
npx create-express-ts ./apps/notification

rm -f ./apps/gateway/yarn.lock
rm -f ./apps/auth-service/yarn.lock
rm -f ./apps/notification/yarn.lock
```

---

```bash

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


```

```bash
chmod +x create-types.sh
./create-types.sh 
```

A .proto file is a text file used with Google's Protocol Buffers (protobuf) serialization mechanism to define data structures, service interfaces, and message types in a language-neutral format. These files act as a schema that allows code generators to create data access classes for various programming languages, ensuring consistent, efficient, and typed data exchange between systems.

---

Make sure @repo/types is added as a dependency:

```bash

pnpm add @repo/types -w --workspace


```

Not in root but to all service or specific

```bash
pnpm add @repo/types -w --filter ./apps/*
```


