import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ProductsModule,
    CategoryModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/nest',
      {
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('MongoDB Connected'));
          connection.on('open', () => console.log('MongoDB Connection Open'));
          connection.on('disconnected', () =>
            console.log('MongoDB Disconnected'),
          );
          connection.on('reconnected', () =>
            console.log('MongoDB Reconnected'),
          );
          connection.on('disconnecting', () =>
            console.log('MongoDB Disconnecting'),
          );
        },
      },
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
