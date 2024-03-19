/*
  Warnings:

  - Added the required column `title` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "title" TEXT NOT NULL;
