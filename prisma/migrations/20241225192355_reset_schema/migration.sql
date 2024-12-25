/*
  Warnings:

  - You are about to drop the column `lessIdcd` on the `GeneralInformation` table. All the data in the column will be lost.
  - You are about to drop the column `lessSecurityHeld` on the `GeneralInformation` table. All the data in the column will be lost.
  - You are about to drop the column `provision` on the `GeneralInformation` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `GeneralInformation` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `GeneralInformation` table. All the data in the column will be lost.
  - Made the column `status` on table `GeneralInformation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GeneralInformation" DROP COLUMN "lessIdcd",
DROP COLUMN "lessSecurityHeld",
DROP COLUMN "provision",
DROP COLUMN "subTotal",
DROP COLUMN "total",
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NEW';
