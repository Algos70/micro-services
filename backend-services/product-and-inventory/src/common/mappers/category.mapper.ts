import { CategoryDocument } from '../../modules/category/schemas/category.schema';
import { CategoryResponseDto } from '../../modules/category/dto/responses/category-response.dto';

export function mapCategoryToResponseDto(
  category: CategoryDocument,
): CategoryResponseDto {
  return {
    id: category._id.toString(),
    name: category.name,
    parentId: category.parentCategory
      ? category.parentCategory.toString()
      : null,
  };
}
