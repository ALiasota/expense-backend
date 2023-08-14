import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

config();

@Module({
  controllers: [],
  providers: [],
  imports: [
    MongooseModule.forRoot(process.env.MANGO_URL),
    UsersModule,
    AuthModule,
    CategoriesModule,
  ],
})
export class AppModule {}
