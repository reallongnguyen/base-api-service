-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('publishPost', 'likePost', 'commentPost', 'likeComment', 'replyComment', 'updateProfile');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "subjects" JSONB[],
    "subject_count" INTEGER NOT NULL,
    "di_object" JSONB,
    "in_object" JSONB,
    "pr_object" JSONB,
    "text" TEXT NOT NULL,
    "decorators" JSONB[],
    "link" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "read_at" TIMESTAMPTZ,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notifications_key_key" ON "notifications"("key");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING HASH ("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");
