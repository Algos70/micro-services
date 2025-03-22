import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AllExceptionsFilter } from '../../common/filters/exception.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern('create-category')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @EventPattern('find-all-categories')
  findAll() {
    return this.categoryService.findAll();
  }

  @EventPattern('find-one-category')
  findOne(@Payload() id: number) {
    return this.categoryService.findOne(id);
  }

  @EventPattern('update-category')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @EventPattern('remove-category')
  remove(@Payload() id: number) {
    return this.categoryService.delete(id);
  }
}
