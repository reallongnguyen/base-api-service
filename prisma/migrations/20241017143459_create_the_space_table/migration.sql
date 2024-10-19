/*
  Warnings:

  - The `roles` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'admin', 'root');

-- CreateEnum
CREATE TYPE "space_member_role" AS ENUM ('owner', 'admin', 'member');

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "roles" "user_role"[];

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_in_spaces" (
    "user_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL,
    "role" "space_member_role" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_in_spaces_pkey" PRIMARY KEY ("user_id","space_id")
);

-- AddForeignKey
ALTER TABLE "user_in_spaces" ADD CONSTRAINT "user_in_spaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_in_spaces" ADD CONSTRAINT "user_in_spaces_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
