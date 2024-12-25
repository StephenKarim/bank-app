/*
  Warnings:

  - You are about to drop the column `idcd` on the `Liability` table. All the data in the column will be lost.
  - You are about to drop the column `lessSecurityHeld` on the `Liability` table. All the data in the column will be lost.
  - You are about to drop the column `provision` on the `Liability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Liability" DROP COLUMN "idcd",
DROP COLUMN "lessSecurityHeld",
DROP COLUMN "provision";

-- CreateTable
CREATE TABLE "_DebtorSecurities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtorSecurities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DebtorSecurities_B_index" ON "_DebtorSecurities"("B");

-- AddForeignKey
ALTER TABLE "_DebtorSecurities" ADD CONSTRAINT "_DebtorSecurities_A_fkey" FOREIGN KEY ("A") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtorSecurities" ADD CONSTRAINT "_DebtorSecurities_B_fkey" FOREIGN KEY ("B") REFERENCES "Security"("id") ON DELETE CASCADE ON UPDATE CASCADE;
