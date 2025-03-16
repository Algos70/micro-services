import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  id: mongoose.Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  vendor_id: number;
  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
