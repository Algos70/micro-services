export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  stock: number;
  vendor_id: string;
  category_id: string;
  image: string | null;
}