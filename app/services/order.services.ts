import prisma from '../lib/prisma';
import { Order, OrderCreateInput, OrderUpdateInput, OrderItem, OrderItemInput } from '../types/order';
import { PaginationParams, PaginatedResponse, OrderStatus, PaymentStatus } from '../types';

/**
 * Generate order number with format: DH + YYYYMM + XX
 * Example: DH20260101, DH20260102, ...
 */
async function generateOrderNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `DH${year}${month}`;

  // Find the last order of this month
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
    select: {
      orderNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastOrder) {
    // Extract the sequence number from the last order number
    const lastSequence = parseInt(lastOrder.orderNumber.slice(prefix.length), 10);
    if (!isNaN(lastSequence)) {
      nextNumber = lastSequence + 1;
    }
  }

  // Format: DH + YYYYMM + XX (2 digits, padded with zeros)
  return `${prefix}${String(nextNumber).padStart(2, '0')}`;
}

export async function createOrderWithItems(
  clientId: string,
  items: OrderItemInput[],
  note?: string,
  discount: number = 0
): Promise<Order> {
  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map(p => [p.id, p]));

  const orderItems = items.map(item => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    
    const unitPrice = Number(product.price);
    const total = unitPrice * item.quantity;
    
    return {
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      total,
    };
  });


  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  // Generate order number
  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clientId,
      subtotal,
      discount,
      total,
      note,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
      client: true,
    },
  });

  return toOrderWithRelations(order);
}

export async function getAllOrders(params: PaginationParams): Promise<PaginatedResponse<Order>> {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' as const } },
          { client: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { client: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map(toOrder),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) return null;

  return toOrder(order);
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order) return null;

  return toOrder(order);
}

export async function getOrderWithItems(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) return null;

  return toOrderWithRelations(order);
}

export async function getOrderWithClient(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!order) return null;

  return toOrderWithRelations(order);
}

export async function getOrdersByClientId(
  clientId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Order>> {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params || {};
  const skip = (page - 1) * limit;

  const where = { clientId };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map(toOrderWithRelations),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateOrder(id: string, data: OrderUpdateInput): Promise<Order> {
  const order = await prisma.order.update({
    where: { id },
    data,
  });

  return toOrder(order);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return toOrder(order);
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus },
  });

  return toOrder(order);
}

export async function deleteOrder(id: string): Promise<void> {
  await prisma.order.delete({
    where: { id },
  });
}

function toOrder(order: any): Order {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    clientId: order.clientId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    note: order.note,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function toOrderWithRelations(order: any): Order {
  return {
    ...toOrder(order),
    client: order.client,
    items: order.items?.map((item: any) => toOrderItem(item)),
    invoice: order.invoice,
  };
}

function toOrderItem(item: any): OrderItem {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.total,
    product: item.product,
  };
}