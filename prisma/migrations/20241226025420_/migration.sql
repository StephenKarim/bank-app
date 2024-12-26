/*
  Warnings:

  - Changed the type of `valuation` on the `Security` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Security" DROP COLUMN "valuation",
ADD COLUMN     "valuation" TIMESTAMP(3) NOT NULL;
