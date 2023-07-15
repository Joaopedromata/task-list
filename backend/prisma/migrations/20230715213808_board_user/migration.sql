-- CreateTable
CREATE TABLE "users_boards" (
    "id" SERIAL NOT NULL,
    "board_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "users_boards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_boards_user_id_board_id_key" ON "users_boards"("user_id", "board_id");

-- AddForeignKey
ALTER TABLE "users_boards" ADD CONSTRAINT "users_boards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_boards" ADD CONSTRAINT "users_boards_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
