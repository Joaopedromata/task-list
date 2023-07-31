-- CreateTable
CREATE TABLE "boards_tasks" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "board_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "boards_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boards_tasks_uuid_key" ON "boards_tasks"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "boards_tasks_task_id_board_id_key" ON "boards_tasks"("task_id", "board_id");

-- AddForeignKey
ALTER TABLE "boards_tasks" ADD CONSTRAINT "boards_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards_tasks" ADD CONSTRAINT "boards_tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
