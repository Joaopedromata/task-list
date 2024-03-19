/*
  Warnings:

  - Added the required column `user_id` to the `financings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "financings" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "financings" ADD CONSTRAINT "financings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
