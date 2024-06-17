-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('post', 'like', 'cmt', 'rep', 'updt');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "subjects" JSONB[],
    "subject_count" INTEGER NOT NULL,
    "di_object" JSONB NOT NULL,
    "in_object" JSONB NOT NULL,
    "pr_object" JSONB NOT NULL,
    "text" TEXT NOT NULL,
    "decorators" JSONB[],
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "read_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_key_read_at_idx" ON "notifications"("key", "read_at" DESC);

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING HASH ("user_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");
