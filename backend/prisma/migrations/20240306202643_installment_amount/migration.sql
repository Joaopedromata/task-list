/*
  Warnings:

  - You are about to drop the column `first_installment_amount` on the `financings` table. All the data in the column will be lost.
  - You are about to drop the column `last_installment_amount` on the `financings` table. All the data in the column will be lost.
  - Added the required column `installment_amount` to the `financings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "financings" DROP COLUMN "first_installment_amount",
DROP COLUMN "last_installment_amount",
ADD COLUMN     "installment_amount" DOUBLE PRECISION NOT NULL;
