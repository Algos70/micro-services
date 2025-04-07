export class ReduceStockDto {
  event: string;
  transaction_id: string;
  data: Data;
}

export interface Data {
  products: _Product[];
}

export interface _Product {
  product_id: string;
  quantity: number;
}
