import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { Address } from '../interface/address';


export class ChangeAddressDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  accountId: number;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    required: true,
  })
  address: Address;
}