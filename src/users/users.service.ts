import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = new this.userModel(dto);
    return user.save();
  }

  async getUserByName(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async getAllUsers() {
    const users = await this.userModel.find({});
    return users;
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
