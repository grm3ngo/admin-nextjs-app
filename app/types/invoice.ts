import type { BaseEntity, PaymentStatus, Money } from './common';
import type { Client } from './client';
import type { Order } from './order';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  orderId: string;
  clientId: string;
  amount: Money;
  paymentStatus: PaymentStatus;
  paidAt: Date | null;
  note: string | null;
  // Relations
  order?: Order;
  client?: Client;
}

export interface InvoiceCreateInput {
  orderId: string;
  clientId: string;
  amount: number;
  note?: string;
}

export interface InvoiceUpdateInput {
  paymentStatus?: PaymentStatus;
  paidAt?: Date;
  note?: string;
}