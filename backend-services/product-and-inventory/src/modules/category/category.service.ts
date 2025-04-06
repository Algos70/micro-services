import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { ApiResponseInterface } from '../../common/dto/api-response.interface';
import { mapCategoryToResponseDto } from '../../common/mappers/category.mapper';
import { CategoryResponseDto } from './dto/responses/category-response.dto';
import { CategoryTreeResponseDto } from './dto/responses/category-tree-response.dto';
import { CategoryEvents } from '../../common/events/registry.events';

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
        event: CategoryEvents.CREATE,
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
      event: CategoryEvents.CREATE,
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
      category.parentCategory = new mongoose.Types.ObjectId(parentCategory._id);
    }

    await category.save();

    const responseDto = mapCategoryToResponseDto(category);
    return {
      event: CategoryEvents.UPDATE,
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
      event: CategoryEvents.DELETE,
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
      event: CategoryEvents.FIND_SUBCATEGORIES_BY_ID,
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
      event: CategoryEvents.FIND_ALL_PARENTS,
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
      event: CategoryEvents.FIND_ONE_BY_ID,
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
      event: CategoryEvents.FIND_ALL,
      status: 'success',
      message: null,
      data: responseDto,
    };
  }

  async findCategoryTree(): Promise<
    ApiResponseInterface<CategoryTreeResponseDto[]>
  > {
    // fetch all categories
    const categories = (await this.findAllCategories()).data;
    if (categories == null || categories.length === 0) {
      return {
        event: CategoryEvents.FIND_CATEGORY_TREE,
        status: 'success',
        message: null,
        data: [],
      };
    }

    const childrenMap = new Map<string, CategoryResponseDto[]>();
    categories.forEach((category) => {
      if (category.parentId) {
        if (!childrenMap.has(category.parentId)) {
          childrenMap.set(category.parentId, []);
        }
        childrenMap.get(category.parentId)!.push(category);
      }
    });

    const roots = categories
      .filter((category) => category.parentId === null)
      .map((root) => ({
        id: root.id,
        name: root.name,
        children: childrenMap.get(root.id) || [],
      }));

    return { event: CategoryEvents.FIND_CATEGORY_TREE, status: 'success', message: null, data: roots };
  }
}
