/*
  Warnings:

  - Added the required column `due_date_first` to the `financing_installments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "financing_installments" ADD COLUMN     "due_date_first" TIMESTAMP(3) NOT NULL;
