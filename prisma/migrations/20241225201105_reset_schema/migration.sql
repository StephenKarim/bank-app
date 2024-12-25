/*
  Warnings:

  - You are about to drop the column `identificationId` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the `Identification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Debtor" DROP CONSTRAINT "Debtor_identificationId_fkey";

-- DropIndex
DROP INDEX "Debtor_identificationId_key";

-- AlterTable
ALTER TABLE "Debtor" DROP COLUMN "identificationId",
ADD COLUMN     "driversPermit" TEXT,
ADD COLUMN     "nationalID" TEXT,
ADD COLUMN     "passport" TEXT;

-- DropTable
DROP TABLE "Identification";
