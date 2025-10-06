-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL,
    "source_account_id" VARCHAR NOT NULL,
    "target_account_id" VARCHAR NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR,
    "status" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
