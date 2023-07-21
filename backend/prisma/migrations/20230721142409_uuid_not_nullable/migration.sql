/*
  Warnings:

  - Made the column `uuid` on table `boards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `users_boards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "boards" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "users_boards" ALTER COLUMN "uuid" SET NOT NULL;
