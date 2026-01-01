import { PrismaClient } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

// ============================================
// SEED ADMIN
// ============================================
async function seedAdmin() {
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  const existing = await prisma.admin.findUnique({
    where: { email: 'superadmin@admin.com' },
  });

  if (existing) {
    console.log('✅ SuperAdmin already exists:', existing.email);
    return existing;
  }

  const superadmin = await prisma.admin.create({
    data: {
      email: 'superadmin@admin.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ SuperAdmin created:', superadmin.email);
  return superadmin;
}

// ============================================
// SEED CLIENTS (4 khách hàng)
// ============================================
async function seedClients() {
  const clientsData = [
    { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', address: '123 Nguyễn Huệ, Q1, TP.HCM' },
    { name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', address: '456 Lê Lợi, Q3, TP.HCM' },
    { name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', address: '789 Hai Bà Trưng, Q1, TP.HCM' },
    { name: 'Phạm Thị D', email: 'phamthid@gmail.com', phone: '0934567890', address: '321 Võ Văn Tần, Q3, TP.HCM' },
  ];

  const clients = [];
  for (const data of clientsData) {
    const existing = await prisma.client.findUnique({ where: { email: data.email } });
    if (existing) {
      console.log(`✅ Client exists: ${data.name}`);
      clients.push(existing);
    } else {
      const client = await prisma.client.create({ data: { ...data, status: 'ACTIVE' } });
      console.log(`✅ Client created: ${client.name}`);
      clients.push(client);
    }
  }
  return clients;
}

// ============================================
// SEED PRODUCTS (4 sản phẩm)
// ============================================
async function seedProducts() {
  const productsData = [
    { name: 'iPhone 15 Pro Max', sku: 'IP15PM', description: 'Điện thoại Apple iPhone 15 Pro Max 256GB', price: 34990000, quantity: 50, image: '/images/iphone15.jpg' },
    { name: 'MacBook Pro M3', sku: 'MBP-M3', description: 'Laptop Apple MacBook Pro 14 inch M3 Pro', price: 49990000, quantity: 30, image: '/images/macbook.jpg' },
    { name: 'AirPods Pro 2', sku: 'APP2', description: 'Tai nghe Apple AirPods Pro thế hệ 2', price: 6490000, quantity: 100, image: '/images/airpods.jpg' },
    { name: 'iPad Pro M2', sku: 'IPADM2', description: 'Máy tính bảng Apple iPad Pro 12.9 inch M2', price: 28990000, quantity: 40, image: '/images/ipad.jpg' },
  ];

  const products = [];
  for (const data of productsData) {
    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing) {
      console.log(`✅ Product exists: ${data.name}`);
      products.push(existing);
    } else {
      const product = await prisma.product.create({ data: { ...data, status: 'ACTIVE' } });
      console.log(`✅ Product created: ${product.name}`);
      products.push(product);
    }
  }
  return products;
}

// ============================================
// SEED ORDERS (4 đơn hàng)
// ============================================
async function seedOrders(clients: any[], products: any[]) {
  const orders = [];

  for (let i = 0; i < 4; i++) {
    const client = clients[i];
    const product = products[i];
    const quantity = i + 1;
    const unitPrice = Number(product.price);
    const subtotal = unitPrice * quantity;
    const discount = i === 0 ? 500000 : 0; // Đơn đầu giảm 500k
    const total = subtotal - discount;

    const orderNumber = `DH2026010${i + 1}`;

    const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
    if (existingOrder) {
      console.log(`✅ Order exists: ${orderNumber}`);
      orders.push(existingOrder);
      continue;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: client.id,
        status: i < 2 ? 'COMPLETED' : 'PENDING',
        paymentStatus: i < 2 ? 'PAID' : 'UNPAID',
        subtotal,
        discount,
        total,
        note: `Đơn hàng số ${i + 1}`,
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice,
            total: unitPrice * quantity,
          },
        },
      },
    });

    console.log(`✅ Order created: ${order.orderNumber}`);
    orders.push(order);
  }

  return orders;
}

// ============================================
// SEED INVOICES (4 hóa đơn)
// ============================================
async function seedInvoices(orders: any[], clients: any[]) {
  for (let i = 0; i < 4; i++) {
    const order = orders[i];
    const client = clients[i];
    const invoiceNumber = `HD2026010${i + 1}`;

    const existingInvoice = await prisma.invoice.findUnique({ where: { invoiceNumber } });
    if (existingInvoice) {
      console.log(`✅ Invoice exists: ${invoiceNumber}`);
      continue;
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        clientId: client.id,
        amount: order.total,
        paymentStatus: i < 2 ? 'PAID' : 'UNPAID',
        paidAt: i < 2 ? new Date() : null,
        note: `Hóa đơn cho đơn hàng ${order.orderNumber}`,
      },
    });

    console.log(`✅ Invoice created: ${invoice.invoiceNumber}`);
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('🌱 Starting seed...\n');

  // 1. Seed Admin
  await seedAdmin();

  // 2. Seed Clients
  const clients = await seedClients();

  // 3. Seed Products
  const products = await seedProducts();

  // 4. Seed Orders
  const orders = await seedOrders(clients, products);

  // 5. Seed Invoices
  await seedInvoices(orders, clients);

  console.log('\n✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });