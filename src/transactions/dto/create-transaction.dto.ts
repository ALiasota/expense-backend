import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'fdgdfgdfgdf', description: 'category id' })
  @IsString({ message: 'Must be a string' })
  readonly category: string;

  @ApiProperty({ example: '500', description: 'amount' })
  @IsNumber({}, { message: 'Must be a number' })
  readonly amount: number;

  @ApiProperty({
    example: '2022-09-08T17:39:56.323+00:00',
    description: 'transaction date',
  })
  @IsString({ message: 'Must be a date' })
  readonly date: string;
}
