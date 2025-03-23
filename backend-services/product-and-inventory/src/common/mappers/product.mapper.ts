import { ProductDocument } from '../../modules/products/schemas/product.schema';
import { ProductResponseDto } from '../../modules/products/dto/responses/product-response.dto';

export function mapProductToResponseDto(
  product: ProductDocument,
): ProductResponseDto {
  return {
    id: product._id.toString(),
    vendor_id: product.vendor_id,
    category_id: product.category_id?.toString() || '',
    name: product.name,
    price: product.price,
    stock: product.stock,
    image: product.image,
  };
}
