import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './categories.schema';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    UsersModule,
    TransactionsModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
