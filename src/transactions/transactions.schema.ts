import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.schema';
import { Category } from '../categories/categories.schema';

@Schema()
export class Transaction extends mongoose.Document {
  @ApiProperty({ example: 'jhgjkhgjhg', description: 'user id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @ApiProperty({ example: 'gdfgdgfgd', description: 'label id' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @ApiProperty({
    example: '2022-09-08T17:39:56.323+00:00',
    description: 'date',
  })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: '5000', description: 'amount' })
  @Prop({ default: Date.now, required: true })
  date: Date;

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

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
