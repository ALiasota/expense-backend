import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'hitman', description: 'username' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ example: '1', description: 'username' })
  @Prop({ required: true, unique: true })
  displayName: string;

  @ApiProperty({ example: 'ADMIN', description: 'role' })
  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @ApiProperty({ example: '*****', description: 'refresh token' })
  @Prop({ required: false })
  refreshToken: string;

  @ApiProperty({ example: '*****', description: 'password' })
  @Prop({ required: true })
  password: string;

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
