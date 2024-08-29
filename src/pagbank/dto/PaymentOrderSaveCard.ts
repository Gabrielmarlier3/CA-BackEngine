import { ApiProperty } from '@nestjs/swagger';

export class CardHolderDto {
  @ApiProperty({
    description: 'Name of the card holder',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Tax ID (CPF/CNPJ) of the card holder',
    example: '123.456.789-00',
  })
  tax_id: string;
}

export class CreditCardDto {
  @ApiProperty({
    description: 'ID of the credit card',
    example: 'cc_1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Security code (CVV) of the credit card',
    example: '123',
  })
  security_code: string;

  @ApiProperty({
    description: 'Holder information of the credit card',
    type: CardHolderDto,
  })
  holder: CardHolderDto;

  @ApiProperty({
    description: 'Indicates if the payment method should be stored for future use',
    example: true,
  })
  store: boolean;
}

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Type of payment method',
    example: 'CREDIT_CARD',
    enum: ['CREDIT_CARD'],
  })
  type: 'CREDIT_CARD';

  @ApiProperty({
    description: 'Number of installments for the payment',
    example: 1,
  })
  installments: number;

  @ApiProperty({
    description: 'Indicates if the payment should be captured immediately',
    example: true,
  })
  capture: boolean;

  @ApiProperty({
    description: 'Soft descriptor for the payment method',
    example: 'MYSHOP*ONLINE',
  })
  soft_descriptor: string;

  @ApiProperty({
    description: 'Credit card information',
    type: CreditCardDto,
  })
  card: CreditCardDto;
}

export class AmountDto {
  @ApiProperty({
    description: 'Amount to be charged',
    example: 10000,
  })
  value: number;

  @ApiProperty({
    description: 'Currency of the amount',
    example: 'USD',
  })
  currency: string;
}

export class ChargeDto {
  @ApiProperty({
    description: 'Unique reference ID for the charge',
    example: 'charge_1234567890abcdef',
  })
  reference_id: string;

  @ApiProperty({
    description: 'Description of the charge',
    example: 'Payment for order #1234',
  })
  description: string;

  @ApiProperty({
    description: 'Amount details for the charge',
    type: AmountDto,
  })
  amount: AmountDto;

  @ApiProperty({
    description: 'Payment method details',
    type: PaymentMethodDto,
  })
  payment_method: PaymentMethodDto;

  @ApiProperty({
    description: 'Additional metadata for the charge',
    example: { order_id: '1234', customer_id: '5678' },
  })
  metadata: { [key: string]: string };

  @ApiProperty({
    description: 'URLs for payment notifications',
    example: ['https://example.com/notify'],
    isArray: true,
  })
  notification_urls: string[];
}

export class PaymentRequestDto {
  @ApiProperty({
    description: 'List of charges for the payment request',
    type: [ChargeDto],
  })
  charges: ChargeDto[];
}
