import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  newPassword: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  refactorCode: number
}