import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Зарплата', description: 'label' })
  @IsString({ message: 'Must be a string' })
  readonly label: string;
}
