import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MaxLength(256)
  name: string;

  @IsString()
  @MaxLength(256)
  species: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  breed?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profilePhoto?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  weight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  food?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  healthIssues?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  medicine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  behavioralIssues?: string;
}
