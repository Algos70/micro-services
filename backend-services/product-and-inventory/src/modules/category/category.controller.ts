import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { AllExceptionsFilter } from '../../common/filters/exception.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern('create-category')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @EventPattern('update-category')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @EventPattern('remove-category')
  delete(@Payload() id: string) {
    return this.categoryService.delete(id);
  }

  @EventPattern('find-all-subcategories-by-id')
  findAllSubcategoriesById(@Payload() id: string) {
    return this.categoryService.findAllSubcategoriesById(id);
  }

  @EventPattern('find-all-parent-categories')
  findAllParentCategories() {
    return this.categoryService.findAllParentCategories();
  }

  @EventPattern('find-one-category-by-id')
  findOneById(@Payload() id: string) {
    return this.categoryService.findOneById(id);
  }

  @EventPattern('find-all-categories')
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @EventPattern('find-category-tree')
  findCategoryTree() {
    return this.categoryService.findCategoryTree();
  }
}
