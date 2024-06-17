/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "notifications_key_read_at_idx";

-- CreateIndex
CREATE UNIQUE INDEX "notifications_key_key" ON "notifications"("key");
