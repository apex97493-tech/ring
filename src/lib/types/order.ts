export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  productSlug: string;
  metal: string;
  size: string;
  carat?: string;
  engraving?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
};

export type PaymentDetails = {
  method: 'paypal' | 'card' | 'payoneer' | 'whatsapp';
  status: 'paid' | 'pending' | 'failed' | 'awaiting_confirmation';
  transactionId?: string;
  payerEmail?: string;
  payoneerReference?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  currency: string;
  currencySymbol: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  payment: PaymentDetails;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
};
