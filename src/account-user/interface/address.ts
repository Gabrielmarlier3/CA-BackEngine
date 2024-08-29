import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @ApiProperty({ example: 'Rua Arcos', description: 'Street name' })
  street: string;

  @ApiProperty({ example: '123', description: 'House number' })
  number: string;

  @ApiProperty({ example: 'Apt 2', description: 'Additional address information', required: false })
  complement?: string;

  @ApiProperty({ example: 'Belo Horizonte', description: 'City name' })
  city: string;

  @ApiProperty({ example: 'MG', description: 'Region or state code' })
  region_code: string;

  @ApiProperty({ example: 'Brazil', description: 'Country name' })
  country: string;

  @ApiProperty({ example: '30285100', description: 'Postal code' })
  postal_code: string;
}
