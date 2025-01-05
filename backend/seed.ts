import { PrismaClient, UserRoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRoleType.ADMIN,
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      name: 'John Manager',
      email: 'john@example.com',
      password: 'manager123',
      role: UserRoleType.MANAGER,
    },
  });

  const mall1 = await prisma.mall.create({
    data: {
      name: 'City Center Mall',
      manager: {
        connect: { id: manager1.id },
      },
    },
  });

  const mall2 = await prisma.mall.create({
    data: {
      name: 'Harbor Mall',
      manager: {
        connect: { id: manager1.id },
      },
    },
  });

  const storeOwner1 = await prisma.user.create({
    data: {
      name: 'Alice Store Owner',
      email: 'alice@example.com',
      password: 'store123',
      role: UserRoleType.STORE_OWNER,
    },
  });

  const storeOwner2 = await prisma.user.create({
    data: {
      name: 'Bob Store Owner',
      email: 'bob@example.com',
      password: 'store123',
      role: UserRoleType.STORE_OWNER,
    },
  });

  const store1 = await prisma.store.create({
    data: {
      name: 'Fashion Boutique',
      rentAmount: 2500.00,
      mall: {
        connect: { id: mall1.id },
      },
      owner: {
        connect: { id: storeOwner1.id },
      },
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Electronics Store',
      rentAmount: 3500.00,
      mall: {
        connect: { id: mall1.id },
      },
      owner: {
        connect: { id: storeOwner2.id },
      },
    },
  });

  await prisma.payment.createMany({
    data: [
      {
        amount: 2500.00,
        storeId: store1.id,
        userId: storeOwner1.id,
      },
      {
        amount: 3500.00,
        storeId: store2.id,
        userId: storeOwner2.id,
      },
      {
        amount: 2500.00,
        storeId: store1.id,
        userId: storeOwner1.id,
      },
    ],
  });

  console.log('✅ Seed data inserted successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed!');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 