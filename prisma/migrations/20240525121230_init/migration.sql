-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "authId" VARCHAR(36) NOT NULL,
    "name" TEXT,
    "avatar" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_authId_key" ON "users"("authId");
