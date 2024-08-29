export type PaymentType = 'DEBIT_CARD' | 'CREDIT_CARD';

export interface PaymentRequest {
  charges: Charge[];
}

interface Charge {
  reference_id: string;
  description: string;
  amount: Amount;
  payment_method: PaymentMethod;
  metadata: { [key: string]: string };
  notification_urls: string[];
}

 interface Amount {
  value: number;
  currency: string;
}

export interface PaymentMethod {
  type: PaymentType;
  installments: number;
  capture: boolean;
  soft_descriptor: string;
  card: CreditCard;
}

interface CreditCard {
  number: string;
  exp_month: string;
  exp_year: string;
  security_code: string;
  holder: CardHolder;
  //set true if the user want save payment method
  store: boolean;
}

interface CardHolder {
  name: string;
  //cpfCnpj
  tax_id: string;
}
