import type { BaseEntity, OrderStatus, PaymentStatus, Money } from './common';
import type { Client } from './client';
import type { Product } from './product';
import type { Invoice } from './invoice';

export interface Order extends BaseEntity {
  orderNumber: string;
  clientId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: Money;
  discount: Money;
  total: Money;
  note: string | null;
  client?: Client;
  items?: OrderItem[];
  invoice?: Invoice;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
  product?: Product;
}

export interface OrderCreateInput {
  clientId: string;
  items: OrderItemInput[];
  discount?: number;
  note?: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderUpdateInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  discount?: number;
  note?: string;
}