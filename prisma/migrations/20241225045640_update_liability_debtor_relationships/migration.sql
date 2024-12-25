/*
  Warnings:

  - You are about to drop the column `liabilityId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `debtors` on the `Liability` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_liabilityId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "liabilityId";

-- AlterTable
ALTER TABLE "Liability" DROP COLUMN "debtors";

-- CreateTable
CREATE TABLE "_DebtorLiabilities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtorLiabilities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DebtorAccounts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtorAccounts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DebtorLiabilities_B_index" ON "_DebtorLiabilities"("B");

-- CreateIndex
CREATE INDEX "_DebtorAccounts_B_index" ON "_DebtorAccounts"("B");

-- AddForeignKey
ALTER TABLE "_DebtorLiabilities" ADD CONSTRAINT "_DebtorLiabilities_A_fkey" FOREIGN KEY ("A") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtorLiabilities" ADD CONSTRAINT "_DebtorLiabilities_B_fkey" FOREIGN KEY ("B") REFERENCES "Liability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtorAccounts" ADD CONSTRAINT "_DebtorAccounts_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtorAccounts" ADD CONSTRAINT "_DebtorAccounts_B_fkey" FOREIGN KEY ("B") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
