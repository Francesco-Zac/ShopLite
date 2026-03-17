export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  items: CartItem[];
  shipping: ShippingData;
  total: number;
}

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}
