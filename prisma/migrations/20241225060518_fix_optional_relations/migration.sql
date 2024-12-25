/*
  Warnings:

  - You are about to drop the column `limit` on the `Liability` table. All the data in the column will be lost.
  - Added the required column `idcd` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limitCurrency` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limitValue` to the `Liability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Liability" DROP COLUMN "limit",
ADD COLUMN     "idcd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "limitCurrency" TEXT NOT NULL,
ADD COLUMN     "limitValue" DOUBLE PRECISION NOT NULL;
