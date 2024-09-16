import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateMenuDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  description: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  price: number

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  available: boolean

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  userId: number
}