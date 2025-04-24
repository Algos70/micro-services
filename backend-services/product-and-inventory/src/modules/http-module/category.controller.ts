// category-gateway.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { CategoryEvents } from '../../common/events/registry.events';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';
import { CreateCategoryDto } from '../category/dto/requests/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/requests/update-category.dto';

@Controller('categories')
export class CategoryGatewayController {
  constructor(
    @Inject('GATEWAY_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.CREATE, dto).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Put()
  async update(
    @Body() dto: UpdateCategoryDto,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.UPDATE, dto).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.DELETE, id).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get(':id/subcategories')
  async findAllSubcategoriesById(
    @Param('id') id: string,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client
        .send(CategoryEvents.FIND_SUBCATEGORIES_BY_ID, id)
        .pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get('parents')
  async findAllParentCategories(): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.FIND_ALL_PARENTS, {}).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
  ): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.FIND_ONE_BY_ID, id).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get()
  async findAllCategories(): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client.send(CategoryEvents.FIND_ALL, {}).pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }

  @Get('tree')
  async findCategoryTree(): Promise<ApiResponseInterface<any>> {
    return (await lastValueFrom(
      this.client
        .send(CategoryEvents.FIND_CATEGORY_TREE, {})
        .pipe(timeout(5000)),
    )) as ApiResponseInterface<any>;
  }
}
