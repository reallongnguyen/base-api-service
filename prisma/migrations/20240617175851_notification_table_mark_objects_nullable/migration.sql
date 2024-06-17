-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "di_object" DROP NOT NULL,
ALTER COLUMN "in_object" DROP NOT NULL,
ALTER COLUMN "pr_object" DROP NOT NULL;
