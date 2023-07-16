-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "board_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
