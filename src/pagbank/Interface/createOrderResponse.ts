export interface CreateOrderResponse {
  id: string;
  reference_id: string;
  created_at: string;
  shipping: ShippingInfo;
  items: Item[];
  customer: Customer;
  charges: Charge[];
  qr_codes: QRCode[];
  links: Link[];
}

interface ShippingInfo {
  address: Address;
}

interface Address {
  street: string;
  number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  country: string;
  postal_code: string;
}

interface Item {
  reference_id: string;
  name: string;
  quantity: number;
  unit_amount: number;
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

interface Charge {} // Como não há detalhes para "charges", deixei vazia

interface QRCode {
  id: string;
  amount: {
    value: number;
  };
  text: string;
  links: Link[];
}

interface Link {
  rel: string;
  href: string;
  media: string;
  type: string;
}
