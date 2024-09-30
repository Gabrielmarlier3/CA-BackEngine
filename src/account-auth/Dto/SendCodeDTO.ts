import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDTO {
  @IsString()
  @IsEmail()
  @ApiProperty({
    required: true,
    example: 'gabrielmarliere2005@gmail.com'
  })
  email: string;
}