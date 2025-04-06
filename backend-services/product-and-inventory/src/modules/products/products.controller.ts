import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { AllExceptionsFilter } from '../../common/filters/exception.filter';
import { ProductEvents } from '../../common/events/registry.events';
import { ReduceStockDto } from './dto/requests/reduce-stock.dto';
import { IncreaseStockDto } from './dto/requests/increase-stock.dto';

@Controller()
@UseFilters(AllExceptionsFilter)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @EventPattern(ProductEvents.CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @EventPattern(ProductEvents.FIND_ALL)
  findAll() {
    return this.productsService.findAll();
  }

  @EventPattern(ProductEvents.FIND_ONE_BY_ID)
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }

  @EventPattern(ProductEvents.UPDATE)
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @EventPattern(ProductEvents.DELETE)
  remove(@Payload() id: string) {
    return this.productsService.delete(id);
  }

  @EventPattern(ProductEvents.FIND_STOCK_BY_ID)
  findStock(@Payload() id: string) {
    return this.productsService.getStock(id);
  }

  @EventPattern(ProductEvents.FIND_BY_NAME)
  findByName(@Payload() name: string) {
    return this.productsService.findByName(name);
  }

  @EventPattern(ProductEvents.FIND_BY_CATEGORY)
  findByCategory(@Payload() category: string) {
    return this.productsService.findByCategory(category);
  }

  @EventPattern(ProductEvents.REDUCE_STOCK)
  reduceStock(@Payload() reduceStockDto: ReduceStockDto) {
    return this.productsService.reduceStock(reduceStockDto);
  }

  @EventPattern(ProductEvents.INCREASE_STOCK)
  increaseStock(@Payload() increaseStockDto: IncreaseStockDto) {
    return this.productsService.increaseStock(increaseStockDto);
  }

  @EventPattern(ProductEvents.ROLLBACK_STOCK)
  rollbackStock(@Payload() transaction_id: string) {
    return this.productsService.reduceRollBack(transaction_id);
  }
}
