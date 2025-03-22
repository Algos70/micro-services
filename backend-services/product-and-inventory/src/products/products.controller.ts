import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller()
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
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id);
  }

  @EventPattern('update-product')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @EventPattern('remove-product')
  remove(@Payload() id: number) {
    return this.productsService.remove(id);
  }
}
