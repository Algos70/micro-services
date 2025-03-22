import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';
import { ProductResponseDto } from './dto/responses/product-response.dto';
import { mapProductToResponseDto } from '../../common/mappers/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) : Promise<ApiResponseInterface<ProductResponseDto>> {
    const categoryResponse = await CategoryService.prototype.findOneById(createProductDto.category_id);
    if (categoryResponse.status != 'success') {
      throw new RpcException('Category not found');
    }

    // TODO:  validate vendor id later

    const newProduct =  await this.productModel.create(createProductDto);

    const responseDto = mapProductToResponseDto(newProduct);
    return {
      status: 'success',
      message: null,
      data: responseDto,
    }
  }

  async update(updateProductDto: UpdateProductDto) : Promise<ApiResponseInterface<ProductResponseDto>> {
    const product = await this.productModel.findById(updateProductDto.id).exec();
    if (product == null) {
      throw new RpcException('Product not found');
    }

    if (updateProductDto.category_id != null) {
      const categoryResponse = await CategoryService.prototype.findOneById(updateProductDto.category_id);
      if (categoryResponse.status != 'success') {
        throw new RpcException('Category not found');
      }
      product.category_id = new mongoose.Types.ObjectId(updateProductDto.category_id);

    }

    if (updateProductDto.name != null) {
      product.name = updateProductDto.name;
    }

    if (updateProductDto.price != null) {
      product.price = updateProductDto.price;
    }

    if (updateProductDto.vendor_id != null) {
      product.vendor_id = updateProductDto.vendor_id;

      // TODO:  validate vendor id later
    }

    if (updateProductDto.stock != null) {
      product.stock = updateProductDto.stock;
    }

    if (updateProductDto.image != null) {
      product.image = updateProductDto.image;
    }

    await product.save();

    const responseDto = mapProductToResponseDto(product);

    return {
      message: null,
      status: 'success',
      data: responseDto
    }
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    return this.productModel.findOne({ _id: id }).exec();
  }

  async remove(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
