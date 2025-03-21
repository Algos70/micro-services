import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';
import { mapCategoryToResponseDto } from '../../common/mappers/category.mapper';
import { CategoryResponseDto } from './dto/responses/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponseInterface<CategoryResponseDto>> {
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

      const responseDto = mapCategoryToResponseDto(newCategory);

      return {
        status: 'success',
        data: responseDto,
        message: null,
      };
    }

    const newCategory = await this.categoryModel.create({
      name: createCategoryDto.name,
      parentCategory: null,
    });

    const responseDto = mapCategoryToResponseDto(newCategory);

    return {
      status: 'success',
      message: 'Category created successfully',
      data: responseDto,
    };
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseInterface<CategoryResponseDto>> {
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

    const responseDto = mapCategoryToResponseDto(category);
    return {
      status: 'success',
      message: null,
      data: responseDto,
    };
  }

  async delete(id: string): Promise<ApiResponseInterface<string>> {
    const response = await this.findAllSubcategoriesById(id);
    if (response.data !== null && response.data.length !== 0) {
      throw new RpcException('Category has subcategories');
    }
    await this.categoryModel.findByIdAndDelete(id).exec();
    return {
      status: 'success',
      message: null,
      data: id,
    };
  }

  async findAllSubcategoriesById(
    id: string,
  ): Promise<ApiResponseInterface<CategoryResponseDto[]>> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();
    if (category == null) {
      throw new RpcException('Category does not exist');
    }

    const subcategories = await this.categoryModel
      .find({ parentCategory: id })
      .exec();

    const responseDto = subcategories.map((subcategory) =>
      mapCategoryToResponseDto(subcategory),
    );
    return {
      status: 'success',
      message: null,
      data: responseDto,
    };
  }

  async findAllParentCategories(): Promise<
    ApiResponseInterface<CategoryResponseDto[]>
  > {
    const parentCategories = await this.categoryModel
      .find({ parentCategory: null })
      .exec();

    const responseDto = parentCategories.map((category) =>
      mapCategoryToResponseDto(category),
    );
    return {
      status: 'success',
      message: null,
      data: responseDto,
    };
  }

  async findOneById(
    id: string,
  ): Promise<ApiResponseInterface<CategoryResponseDto>> {
    const category = await this.categoryModel.findById(id).exec();
    if (category == null) {
      throw new RpcException('Category not found');
    }

    const responseDto = mapCategoryToResponseDto(category);

    return {
      status: 'success',
      message: null,
      data: responseDto,
    };
  }

  async findAllCategories(): Promise<
    ApiResponseInterface<CategoryResponseDto[]>
  > {
    const categories = await this.categoryModel.find().exec();

    const responseDto = categories.map((category) =>
      mapCategoryToResponseDto(category),
    );
    return {
      status: 'success',
      message: null,
      data: responseDto,
    };
  }
}
