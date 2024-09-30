import { IsString, IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'gabrielmarliere2005@gmail.com'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: '123456'
  })
  password: string;
}