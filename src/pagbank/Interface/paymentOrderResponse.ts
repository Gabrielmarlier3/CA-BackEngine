export interface PaymentOrderResponse {
  id: string;
  reference_id: string;
  created_at: string;
  shipping: Shipping;
  items: Item[];
  customer: Customer;
  charges: Charge[];
  qr_code: QRCode[];
  links: Link[];
}

interface Shipping {
  address: Address;
}

interface Address {
  street: string;
  number: string;
  complement: string;
  locality: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  postal_code: string;
}

interface Item {
  reference_id: string;
  name: string;
  quantity: number;
  unit_amount: number;
  dimensions: Dimensions;
  weight: number;
}

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface Customer {
  name: string;
  email: string;
  tax_id: string;
  phones: Phone[];
}

interface Phone {
  country: string;
  area: string;
  number: string;
  type: string;
}

interface Charge {
  id: string;
  reference_id: string;
  status: string;
  created_at: string;
  paid_at: string;
  description: string;
  amount: Amount;
  payment_response: PaymentResponse;
  payment_method: PaymentMethod;
  links: Link[];
  metadata: { [key: string]: string };
}

interface Amount {
  value: number;
  currency: string;
  summary: Summary;
}

interface Summary {
  total: number;
  paid: number;
  refunded: number;
}

interface PaymentResponse {
  code: string;
  message: string;
  reference: string;
}

interface PaymentMethod {
  type: string;
  installments: number;
  capture: boolean;
  card: Card;
}

interface Card {
  id: string,
  last_digits: string
  brand: string;
  first_digits: string;
  exp_month: string;
  exp_year: string;
  holder: Holder;
}

interface Holder {
  name: string;
  tax_id: string;
}

interface QRCode {
  id: string;
  amount: { value: number };
  text: string;
  links: Link[];
}

interface Link {
  rel: string;
  href: string;
  media: string;
  type: string;
}
