import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDTO {

  @IsNumber()
  @ApiProperty({
    required: false,
    example: 1,
  })
  accountId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    example: "whatever number, brazilian numbers only",
  })
  telephoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    example: 'wherever email',
  })
  email: string

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    example: 'João rodrigues',
  })
  name: string


}