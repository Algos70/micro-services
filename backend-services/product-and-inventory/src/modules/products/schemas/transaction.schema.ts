import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TransactionDocument = HydratedDocument<StockTransaction>;

@Schema({ timestamps: true })
export class StockTransaction {
  @Prop({ required: true })
  transaction_id: string;
  @Prop({ required: true })
  product_id: string;
  @Prop({ required: true })
  stock: number;
  @Prop({ required: true })
  rolled_back: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(StockTransaction);
