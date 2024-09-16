import { IsString, IsEmail, IsNotEmpty, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class DeleteMenuDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  foodIdentifier: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  userId: number

}