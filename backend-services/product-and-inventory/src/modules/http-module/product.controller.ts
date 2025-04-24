import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { ProductEvents } from '../../common/events/registry.events';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';
import { CreateProductDto } from '../products/dto/requests/create-product.dto';
import { UpdateProductDto } from '../products/dto/requests/update-product.dto';
import { IncreaseStockDto } from '../products/dto/requests/increase-stock.dto';

@Controller('products')
export class ProductGatewayController {
  constructor(
    @Inject('GATEWAY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateProductDto,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.CREATE, dto).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Put()
  async update(
    @Body() dto: UpdateProductDto,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.UPDATE, dto).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.DELETE, id).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get()
  async findAll(): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.FIND_ALL, {}).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.FIND_ONE_BY_ID, id).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get(':id/stock')
  async findStock(@Param('id') id: string): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.FIND_STOCK_BY_ID, id).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get('search/by-name')
  async findByName(
    @Query('name') name: string,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.FIND_BY_NAME, name).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get('search/by-category')
  async findByCategory(
    @Query('category') category: string,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client
        .send(ProductEvents.FIND_BY_CATEGORY, category)
        .pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Post('stock/increase')
  async increaseStock(
    @Body() dto: IncreaseStockDto,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(ProductEvents.INCREASE_STOCK, dto).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }
}
