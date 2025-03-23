import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@host.docker.internal:5672'],
        queue: 'products-queue',
      },
    },
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen();
}

bootstrap();
