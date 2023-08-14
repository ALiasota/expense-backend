import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'Andrii', description: 'username' })
  @IsString({ message: 'Must be a string' })
  readonly username: string;

  @ApiProperty({ example: '*****', description: 'password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Min 4 symbols, max 16 symbols' })
  readonly password: string;
}
