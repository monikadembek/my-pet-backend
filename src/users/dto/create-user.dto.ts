import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 256)
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 256)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({ type: String, description: 'password' })
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ type: String, description: 'refreshToken' })
  refreshToken?: string;
}
