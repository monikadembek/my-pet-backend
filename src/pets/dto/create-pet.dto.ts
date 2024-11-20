import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { AdditionalContactDto } from './additional-contact.dto';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'name', required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'species', required: true })
  species: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'breed', required: false })
  breed?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: String, description: 'dateOfBirth', required: false })
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiProperty({ type: String, description: 'profilePhoto', required: false })
  profilePhoto?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ type: String, description: 'height', required: false })
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @ApiProperty({ type: String, description: 'weight', required: false })
  weight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'descrition', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'food', required: false })
  food?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'healthIssues', required: false })
  healthIssues?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'medicine', required: false })
  medicine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    type: String,
    description: 'behavioralIssues',
    required: false,
  })
  behavioralIssues?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, description: 'vetClinicId', required: false })
  vetClinicId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalContactDto)
  @ApiProperty({
    type: () => [AdditionalContactDto],
    description: 'additionalContacts',
    required: false,
  })
  additionalContacts?: AdditionalContactDto[];
}
