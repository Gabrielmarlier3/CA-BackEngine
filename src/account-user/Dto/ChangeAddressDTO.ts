import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { IAddress } from '../interface/IAddress';


export class ChangeAddressDTO {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    example: 1,
  })
  accountId: number;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    required: true,
  })
  address: IAddress;
}