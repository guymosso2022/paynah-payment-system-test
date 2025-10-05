-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "balance" INTEGER NOT NULL,
    "currency" VARCHAR,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
