import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateVetClinicDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 256)
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 500)
  @ApiProperty({ type: String, description: 'address' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
}
