import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsNumber()
  price: number;
  @IsInt()
  stock: number;
  vendor_id: number;
}
