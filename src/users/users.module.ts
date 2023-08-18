import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CategoriesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
