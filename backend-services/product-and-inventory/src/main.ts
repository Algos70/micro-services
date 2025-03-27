import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const maxRetries = 5;
  const retryDelay = 5000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
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
        },
      );
      await app.listen();
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
