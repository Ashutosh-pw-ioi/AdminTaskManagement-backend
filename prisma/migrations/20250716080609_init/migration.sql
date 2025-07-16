-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskAssignedTotal" INTEGER NOT NULL DEFAULT 0,
    "taskCompletedTotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL DEFAULT 'LOW',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "default_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_task_instances" (
    "id" TEXT NOT NULL,
    "taskDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "defaultTaskId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,

    CONSTRAINT "daily_task_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "priority" "Priority" NOT NULL DEFAULT 'LOW',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,

    CONSTRAINT "new_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "operation_email_key" ON "operation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "daily_task_instances_taskDate_defaultTaskId_operatorId_key" ON "daily_task_instances"("taskDate", "defaultTaskId", "operatorId");

-- AddForeignKey
ALTER TABLE "default_tasks" ADD CONSTRAINT "default_tasks_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_task_instances" ADD CONSTRAINT "daily_task_instances_defaultTaskId_fkey" FOREIGN KEY ("defaultTaskId") REFERENCES "default_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_task_instances" ADD CONSTRAINT "daily_task_instances_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_tasks" ADD CONSTRAINT "new_tasks_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "new_tasks" ADD CONSTRAINT "new_tasks_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
