import type { BaseEntity, Status } from './common';

export interface Client extends BaseEntity {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCreateInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: Status;
}

export interface ClientUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: Status;
}