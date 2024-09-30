import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: '12345',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    example: 'gabrielmarliere2005@gmail.com',
  })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  refactorCode: number
}