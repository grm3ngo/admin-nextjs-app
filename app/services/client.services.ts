import prisma from '../lib/prisma';
import { Client, ClientCreateInput, ClientUpdateInput } from '../types/client';
import { PaginationParams, PaginatedResponse } from '../types';

export async function createClient(data: ClientCreateInput): Promise<Client> {
    const client = await prisma.client.create({
        data: {
            email: data.email,
            name: data.name,
            phone: data.phone || null,
            address: data.address || null,
            status: data.status || 'ACTIVE',
        },
    });

    return toClient(client);
}

export async function getAllClients(params: PaginationParams): Promise<PaginatedResponse<Client>> {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [Clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.client.count({ where }),
  ]);

  return {
    data: Clients.map(toClient),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getClientById(id:string): Promise<Client | null> {
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) return null;

  return toClient(client);

}

export async function getClientByEmail(email: string): Promise<Client | null> {
  const client = await prisma.client.findUnique({
    where: { email },
  });

  if (!client) return null;

  return toClient(client);
}

export async function updateClient(id: string, data: ClientUpdateInput): Promise<Client> {
  const updateData: any = { ...data };

  const client = await prisma.client.update({
    where: { id },
    data: updateData,
  });

  return toClient(client);
}

export async function deleteClient(id: string): Promise<void> {
  await prisma.client.delete({
    where: { id },
  });
}

function toClient(client: any): Client { //helper giup tranh lap code
  return {
    id: client.id,
    email: client.email,
    name: client.name,
    phone: client.phone,
    address: client.address,
    status: client.status,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}