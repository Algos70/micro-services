import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ProductsModule,
    CategoryModule,
    MongooseModule.forRoot('mongodb://localhost/nest', {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected'));
        connection.on('open', () => console.log('open'));
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('disconnecting', () => console.log('disconnecting'));
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
