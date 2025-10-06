-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "account_id" VARCHAR,
    "payment_id" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);
