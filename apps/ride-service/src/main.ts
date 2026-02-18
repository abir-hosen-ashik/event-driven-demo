

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.KAFKA,
//       options: {
//         client: {
//           brokers: ['0.0.0.0:9092'],
//         },
//         consumer: {
//           groupId: 'ride-consumer',
//         },
//       },
//     },
//   );
//   await app.listen();
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kafka microservice attach
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['0.0.0.0:9092'] },
      consumer: { groupId: 'ride-consumer' },
    },
  });

  await app.startAllMicroservices(); // Start Kafka listener
  await app.listen(3000); // HTTP server
  console.log('Ride service running on http://localhost:3000');
}
bootstrap();