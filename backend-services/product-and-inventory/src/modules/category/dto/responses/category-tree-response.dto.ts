import { CategoryResponseDto } from './category-response.dto';

export interface CategoryTreeResponseDto {
  id: string;
  name: string;
  children: CategoryResponseDto[];
}
