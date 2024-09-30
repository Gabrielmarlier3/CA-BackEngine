import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateMenuDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: "Burger",
  })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: "Delicious burger",
  })
  description: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: "https://i.pinimg.com/564x/d8/db/26/d8db261699e2cab4c8386c07bf6ee5e8.jpg",
  })
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    example: 20,
  })
  price: number

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    required: true,
    default: true,
    example: true,
  })
  available: boolean

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    example: 1,
  })
  userId: number
}