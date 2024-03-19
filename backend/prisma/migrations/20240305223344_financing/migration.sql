-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "boards_tasks" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users_boards" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "financings" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "installments" INTEGER NOT NULL,

    CONSTRAINT "financings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financing_installments" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid_at" TIMESTAMP(3),
    "paid_amount" DOUBLE PRECISION,
    "financing_id" INTEGER NOT NULL,

    CONSTRAINT "financing_installments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financings_uuid_key" ON "financings"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "financing_installments_uuid_key" ON "financing_installments"("uuid");

-- AddForeignKey
ALTER TABLE "financing_installments" ADD CONSTRAINT "financing_installments_financing_id_fkey" FOREIGN KEY ("financing_id") REFERENCES "financings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
