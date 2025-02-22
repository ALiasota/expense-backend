import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private categoriesService: CategoriesService,
  ) {}

  onModuleInit() {
    this.checkUsers();
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    return user;
  }

  async getUserByName(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async checkUsers() {
    const users = await this.userModel.find({
      defaultCategory: { $exists: false },
    });

    if (users.length) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const defaultCategory =
          await this.categoriesService.getCategoryByNameAndUserId(
            user._id,
            'Інше',
          );
        if (defaultCategory) user.defaultCategory = defaultCategory._id;
        else {
          const newDefaultCategory =
            await this.categoriesService.createCategory(user._id, {
              label: 'Інше',
            });
          user.defaultCategory = newDefaultCategory.id;
        }
        await user.save();
      }
    }
  }
}
