/*
  Warnings:

  - You are about to drop the column `balance` on the `Liability` table. All the data in the column will be lost.
  - Added the required column `debtors` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idcd` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liabilities` to the `Liability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Liability" DROP COLUMN "balance",
ADD COLUMN     "debtors" TEXT NOT NULL,
ADD COLUMN     "idcd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lessSecurityHeld" DOUBLE PRECISION,
ADD COLUMN     "liabilities" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "provision" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "liabilityId" INTEGER NOT NULL,
    "branch" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_liabilityId_fkey" FOREIGN KEY ("liabilityId") REFERENCES "Liability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
