-- DropForeignKey
ALTER TABLE "users_boards" DROP CONSTRAINT "users_boards_board_id_fkey";

-- DropForeignKey
ALTER TABLE "users_boards" DROP CONSTRAINT "users_boards_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users_boards" ADD CONSTRAINT "users_boards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_boards" ADD CONSTRAINT "users_boards_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
