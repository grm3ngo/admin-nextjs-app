import { PrismaClient } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  const existing = await prisma.admin.findUnique({
    where: { email: 'superadmin@admin.com' },
  });

  if (existing) {
    console.log('✅ SuperAdmin already exists:', existing.email);
    return;
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });