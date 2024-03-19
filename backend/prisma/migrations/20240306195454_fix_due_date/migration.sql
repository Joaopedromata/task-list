/*
  Warnings:

  - You are about to drop the column `due_date_first` on the `financing_installments` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `financing_installments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date_first` to the `financings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "financing_installments" DROP COLUMN "due_date_first",
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "financings" ADD COLUMN     "due_date_first" TIMESTAMP(3) NOT NULL;
