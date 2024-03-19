/*
  Warnings:

  - Added the required column `first_installment_amount` to the `financings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_installment_amount` to the `financings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "financings" ADD COLUMN     "first_installment_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "last_installment_amount" DOUBLE PRECISION NOT NULL;
