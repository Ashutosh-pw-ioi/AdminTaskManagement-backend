import { PrismaClient, Priority, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('adminpass', 10);
  const operatorPassword = await bcrypt.hash('operatorpass', 10);

  const admin = await prisma.admin.create({
    data: {
      number: 'ADM001',
      email: 'admin@example.com',
      password: adminPassword,
      gender: 'Male',
      phoneNumber: '9876543210',
    },
  });

  const operator = await prisma.operationTeamMember.create({
    data: {
      name: 'Operator One',
      email: 'operator1@example.com',
      password: operatorPassword,
      phoneNumber: '9123456789',
    },
  });

  const defaultTask = await prisma.defaultTask.create({
    data: {
      title: 'Check inventory',
      description: 'Make sure all shelves are stocked',
      priority: Priority.MEDIUM,
      status: TaskStatus.PENDING,
      adminId: admin.id,
    },
  });

  await prisma.dailyTaskInstance.create({
    data: {
      taskDate: new Date(),
      defaultTaskId: defaultTask.id,
      operatorId: operator.id,
    },
  });

  await prisma.newTask.create({
    data: {
      title: 'Urgent package delivery',
      description: 'Deliver package to client X',
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      priority: Priority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      adminId: admin.id,
      operatorId: operator.id,
    },
  });

  console.log('🌱 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
