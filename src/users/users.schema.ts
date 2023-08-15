import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/categories.schema';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema()
export class User extends mongoose.Document {
  @ApiProperty({ example: 'hitman', description: 'username' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ example: '1', description: 'username' })
  @Prop({ required: true })
  displayName: string;

  @ApiProperty({ example: 'ADMIN', description: 'role' })
  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @ApiProperty({ example: 'password', description: 'refresh token' })
  @Prop({ required: false })
  refreshToken: string;

  @ApiProperty({ example: '*****', description: 'password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'gdfgdgfgd', description: 'label id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  defaultCategory: Category;

  @ApiProperty({
    example: '2022-09-08T17:39:56.323+00:00',
    description: 'createdAt',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    example: '2022-09-08T17:39:56.323+00:00',
    description: 'updatedAt',
  })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
