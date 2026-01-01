import prisma from '../lib/prisma';
import { Product, ProductCreateInput, ProductUpdateInput } from '../types/product';
import { PaginationParams, PaginatedResponse } from '../types';

export async function createProduct(data: ProductCreateInput): Promise<Product> {
    const product = await prisma.product.create({
        data: {
                name: data.name,
                sku: data.sku,
                description: data.description || null,
                price: data.price, 
                quantity: data.quantity || 0,
                image: data.image || null,
                status: data.status || 'ACTIVE',
        },
    });

    return toProduct(product);
}

export async function getAllProducts(params: PaginationParams): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [Products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: Products.map(toProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id:string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  return toProduct(product);

}

export async function getProductByProductNumber(sku: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { sku },
  });

  if (!product) return null;

  return toProduct(product);
}

export async function updateProduct(id: string, data: ProductUpdateInput): Promise<Product> {
  const updateData: any = { ...data };

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return toProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({
    where: { id },
  });
}

export async function updateProductQuantity(id: string, quantity: number): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      quantity: { increment: quantity },
    },
  });

  return toProduct(product);
}

export async function decreaseStock(id: string, quantity: number): Promise<Product> {
  // Kiểm tra tồn kho trước khi trừ
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  
  if (product.quantity < quantity) {
    throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.quantity}, Required: ${quantity}`);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      quantity: { decrement: quantity },
    },
  });

  return toProduct(updated);
}

export async function increaseStock(id: string, quantity: number): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      quantity: { increment: quantity },
    },
  });

  return toProduct(product);
}

function toProduct(product: any): Product { //helper giup tranh lap code
  return {
    id: product.id,
    name: product.name,
    sku: product.sku, 
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    image: product.image,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}