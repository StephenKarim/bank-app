-- CreateTable
CREATE TABLE "Customer" (
    "rimNumber" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cautionCategory" TEXT NOT NULL,
    "cautionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("rimNumber")
);

-- CreateTable
CREATE TABLE "Liability" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "statuteBarred" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Liability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rstc" DOUBLE PRECISION NOT NULL,
    "mv" DOUBLE PRECISION NOT NULL,
    "use" TEXT NOT NULL,
    "demand" TEXT NOT NULL,
    "secures" TEXT NOT NULL,
    "advertised" BOOLEAN NOT NULL,
    "dateAdvertised" TIMESTAMP(3) NOT NULL,
    "valuation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_rimNumber_key" ON "Customer"("rimNumber");

-- AddForeignKey
ALTER TABLE "Liability" ADD CONSTRAINT "Liability_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("rimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("rimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
