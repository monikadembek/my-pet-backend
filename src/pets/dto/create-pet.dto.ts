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
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'species' })
  species: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'breed' })
  breed?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: String, description: 'dateOfBirth' })
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiProperty({ type: String, description: 'profilePhoto' })
  profilePhoto?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ type: String, description: 'height' })
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @ApiProperty({ type: String, description: 'weight' })
  weight?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'descrition' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'food' })
  food?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'healthIssues' })
  healthIssues?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'medicine' })
  medicine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({ type: String, description: 'behavioralIssues' })
  behavioralIssues?: string;

  @IsOptional()
  @IsInt()
  vetClinicId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalContactDto)
  @ApiProperty({
    type: () => AdditionalContactDto,
    description: 'additionalContacts',
  })
  additionalContacts?: AdditionalContactDto[];
}
