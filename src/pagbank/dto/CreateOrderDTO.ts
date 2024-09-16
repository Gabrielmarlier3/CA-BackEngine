export interface OrderRequest {
  reference_id: string;
  customer: Customer;
  items: Item[];
  qr_codes?: QRCode[];
  shipping: ShippingOrBilling;
  billing: ShippingOrBilling;
  notification_urls?: string[];
}

interface Customer {
  name?: string;
  email?: string;
  tax_id: string;
  phones: Phone[];
}

interface Phone {
  country: string;
  area: string;
  number: string;
}

interface Item {
  reference_id: string;
  name: string;
  quantity: number;
  unit_amount: number;
}

interface QRCode {
  amount: Amount;
  expiration_date: string;
}

interface Amount {
  value: number;
}

interface ShippingOrBilling {
  address: Address;
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  locality: string;
  city: string;
  region_code: string;
  country: string;
  postal_code: string;
}
