import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const maxRetries = 5;
  const retryDelay = 5000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const app = await NestFactory.create(AppModule);

      const config = new DocumentBuilder()
        .setTitle('My Hybrid App')
        .setDescription('API documentation for the HTTP part of the app')
        .setVersion('1.0')
        .addTag('products') // optional
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
          ],
          queue: 'products-queue',
          queueOptions: { durable: true },
          socketOptions: {
            heartbeatIntervalInSeconds: 30,
            reconnectTimeInSeconds: 5,
          },
        },
      });
      await app.startAllMicroservices();
      await app.listen(4040);
      logger.log('Microservice connected to RabbitMQ');
    } catch ({ stack }) {
      logger.error(
        `RabbitMQ connection attempt ${attempt}/${maxRetries} failed`,
        stack,
      );

      if (attempt === maxRetries) {
        logger.error('Maximum retry attempts reached. Exiting...');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

bootstrap();
