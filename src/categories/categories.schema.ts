import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.schema';

@Schema()
export class Category extends mongoose.Document {
  @ApiProperty({ example: 'jhgjkhgjhg', description: 'user id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty({ example: 'Зарплата', description: 'label' })
  @Prop({ required: true })
  label: string;

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

export const CategorySchema = SchemaFactory.createForClass(Category);
