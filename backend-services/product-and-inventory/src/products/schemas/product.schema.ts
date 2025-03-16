import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  stock: number;
  @Prop({ required: true })
  vendor_id: number;
  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
