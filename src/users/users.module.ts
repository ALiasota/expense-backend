import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
