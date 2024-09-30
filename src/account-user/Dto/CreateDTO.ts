import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { IAddress } from '../interface/IAddress';


export class CreateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      required: true,
      example:'Gabriel Marliere',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: '123456',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: "919.945.258-86"
  })
  cpfCnpj: string;

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
    example: '31994990939',
  })
  telephone: string;

  @IsBoolean()
  @ApiProperty({
    required: true,
    example: false,
  })
  isLegalPerson: boolean

  @IsObject()
  @ApiProperty({
    required: true,
  })
  address: IAddress;
}