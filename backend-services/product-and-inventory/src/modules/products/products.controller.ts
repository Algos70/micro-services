import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { AllExceptionsFilter } from '../../common/filters/exception.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @EventPattern('create-product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @EventPattern('find-all-products')
  findAll() {
    return this.productsService.findAll();
  }

  @EventPattern('find-one-product')
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }

  @EventPattern('update-product')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @EventPattern('remove-product')
  remove(@Payload() id: string) {
    return this.productsService.delete(id);
  }

  @EventPattern('find-stock')
  findStock(@Payload() id: string) {
    return this.productsService.getStock(id);
  }

  @EventPattern('update-stock')
  updateStock(@Payload() id: string, stock: number) {
    return this.productsService.updateStock(id, stock);
  }

  @EventPattern('find-by-name')
  findByName(@Payload() name: string) {
    return this.productsService.findByName(name);
  }

  @EventPattern('find-by-category')
  findByCategory(@Payload() category: string) {
    return this.productsService.findByCategory(category);
  }
}
