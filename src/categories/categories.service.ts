import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './categories.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private transactionsService: TransactionsService,
  ) {}

  async createCategory(userId: string, dto: CreateCategoryDto) {
    const category = await this.categoryModel.create({
      user: userId,
      label: dto.label,
    });
    return { id: category._id, label: category.label };
  }

  async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { user: userId, label: 'Зарплата' },
      { user: userId, label: 'Подарунки' },
      { user: userId, label: 'Їжа' },
      { user: userId, label: 'Подорож' },
      { user: userId, label: 'Інше' },
    ];
    const categoriesBD = await this.categoryModel.insertMany(defaultCategories);
    const categories = categoriesBD.map((category) => ({
      id: category._id,
      label: category.label,
    }));
    return categories;
  }

  async getUserCategories(userId: string) {
    const categoriesBD = await this.categoryModel.find({ user: userId });
    const categories = categoriesBD.map((category) => ({
      id: category._id,
      label: category.label,
    }));
    return categories;
  }

  async renameCategory(id: string, label: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    else if (category.label === 'Інше')
      throw new BadRequestException("You can't rename this category");
    category.label = label;
    await category.save();
    return { id: category._id, label: category.label };
  }

  async removeCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new BadRequestException('Category not found');
    else if (category.label === 'Інше')
      throw new BadRequestException("You can't remove this category");
    const categoryOther = await this.categoryModel.findOne({ label: 'Інше' });
    if (categoryOther)
      await this.transactionsService.updateUserTransactionsByCategoryId(
        category._id,
        categoryOther._id,
      );
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);
    return { id: deletedCategory._id, label: deletedCategory.label };
  }
}
