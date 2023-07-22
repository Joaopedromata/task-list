-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_board_id_fkey";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
