import prisma from '../lib/prisma';
import { Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '../types/invoice';
import { PaginationParams, PaginatedResponse } from '../types';

export async function createInvoice(data: InvoiceCreateInput): Promise<Invoice> {
    const invoice = await prisma.invoice.create({
        data: {
                orderId: data.orderId,
                clientId: data.clientId,
                amount: data.amount,
                note: data.note,
        },
    });

    return toInvoice(invoice);
}

export async function getAllInvoices(params: PaginationParams): Promise<PaginatedResponse<Invoice>> {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [Invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    data: Invoices.map(toInvoice),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getInvoiceById(id:string): Promise<Invoice | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  if (!invoice) return null;

  return toInvoice(invoice);

}

export async function getInvoiceByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber },
  });

  if (!invoice) return null;

  return toInvoice(invoice);
}

export async function updateInvoice(id: string, data: InvoiceUpdateInput): Promise<Invoice> {
  const updateData: any = { ...data };

  const invoice = await prisma.invoice.update({
    where: { id },
    data: updateData,
  });

  return toInvoice(invoice);
}

export async function deleteInvoice(id: string): Promise<void> {
  await prisma.invoice.delete({
    where: { id },
  });
}

function toInvoice(invoice: any): Invoice { //helper giup tranh lap code
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    orderId: invoice.orderId,
    clientId: invoice.clientId,
    amount: invoice.amount,
    paymentStatus: invoice.paymentStatus,
    paidAt: invoice.paidAt,
    note: invoice.note,
    order: invoice.order,
    client: invoice.client,
  };
}