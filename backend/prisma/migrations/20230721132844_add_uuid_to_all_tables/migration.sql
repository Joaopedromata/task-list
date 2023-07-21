/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `boards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `users_boards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "users_boards" ADD COLUMN     "uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "boards_uuid_key" ON "boards"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_uuid_key" ON "tasks"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_boards_uuid_key" ON "users_boards"("uuid");
