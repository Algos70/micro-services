import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { AllExceptionsFilter } from '../../common/filters/exception.filter';
import { CategoryEvents } from '../../common/events/registry.events';

@Controller()
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern(CategoryEvents.CREATE)
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @EventPattern(CategoryEvents.UPDATE)
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @EventPattern(CategoryEvents.DELETE)
  delete(@Payload() id: string) {
    return this.categoryService.delete(id);
  }

  @EventPattern(CategoryEvents.FIND_SUBCATEGORIES_BY_ID)
  findAllSubcategoriesById(@Payload() id: string) {
    return this.categoryService.findAllSubcategoriesById(id);
  }

  @EventPattern(CategoryEvents.FIND_ALL_PARENTS)
  findAllParentCategories() {
    return this.categoryService.findAllParentCategories();
  }

  @EventPattern(CategoryEvents.FIND_ONE_BY_ID)
  findOneById(@Payload() id: string) {
    return this.categoryService.findOneById(id);
  }

  @EventPattern(CategoryEvents.FIND_ALL)
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @EventPattern(CategoryEvents.FIND_CATEGORY_TREE)
  findCategoryTree() {
    return this.categoryService.findCategoryTree();
  }
}
