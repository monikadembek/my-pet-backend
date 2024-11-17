import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class AdditionalContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
}
