export interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  category: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItemPayload[];
}

export interface OrderResponseItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string | number;
  product: {
    id: string;
    name: string;
    category: string;
  };
}

export interface CreatedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: string | number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';
  createdAt: string;
  items: OrderResponseItem[];
}

