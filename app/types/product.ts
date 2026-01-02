import type { BaseEntity, Status, Money } from './common';

export interface Product extends BaseEntity {
  name: string;
  sku: string | null;
  description: string | null;
  price: Money;
  quantity: number;
  image: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateInput {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  quantity?: number;
  image?: string;
  status?: Status;
}

export interface ProductUpdateInput {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  quantity?: number;
  image?: string;
  status?: Status;
}