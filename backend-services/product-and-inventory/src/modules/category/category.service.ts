import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponseInterface<Category>> {
    const category = await this.categoryModel
      .findOne({ name: createCategoryDto.name })
      .exec();
    if (category != null) {
      throw new RpcException('Category already exists');
    }

    if (createCategoryDto.parentId != null) {
      const parentCategory = await this.categoryModel
        .findOne({ _id: createCategoryDto.parentId })
        .exec();
      if (parentCategory == null) {
        throw new RpcException('Parent category does not exist');
      }
      const newCategory = await this.categoryModel.create({
        name: createCategoryDto.name,
        parentCategory: parentCategory._id,
      });

      return {
        status: 'success',
        data: newCategory,
        message: null,
      };
    }

    const newCategory = await this.categoryModel.create({
      name: createCategoryDto.name,
      parentCategory: null,
    });

    return {
      status: 'success',
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseInterface<Category>> {
    const category = await this.categoryModel
      .findOne({ _id: updateCategoryDto.id })
      .exec();
    if (category == null) {
      throw new RpcException('Category does not exist');
    }

    if (updateCategoryDto.name != null) {
      const categoryWithSameName = await this.categoryModel
        .findOne({ name: updateCategoryDto.name })
        .exec();
      if (categoryWithSameName != null) {
        throw new RpcException('Category with same name already exists');
      }
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.parentId != null) {
      const parentCategory = await this.categoryModel
        .findOne({ _id: updateCategoryDto.parentId })
        .exec();
      if (parentCategory == null) {
        throw new RpcException('Parent category does not exist');
      }
      category.parentCategory = parentCategory;
    }

    await category.save();
    return {
      status: 'success',
      message: null,
      data: category,
    };
  }

  delete(id: number) {
    return `This action removes a #${id} category`;
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }
}
