/*
  Warnings:

  - You are about to drop the column `customerId` on the `Liability` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupRimNumber` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Liability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupRimNumber` to the `Security` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Security` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Liability" DROP CONSTRAINT "Liability_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_customerId_fkey";

-- AlterTable
ALTER TABLE "Liability" DROP COLUMN "customerId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupRimNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Security" DROP COLUMN "customerId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupRimNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "RelegatedGroup" (
    "rimNumber" TEXT NOT NULL,
    "generalInformationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelegatedGroup_pkey" PRIMARY KEY ("rimNumber")
);

-- CreateTable
CREATE TABLE "GeneralInformation" (
    "id" SERIAL NOT NULL,
    "rimNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "branch" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cautionCategory" TEXT NOT NULL,
    "cautionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debtor" (
    "id" SERIAL NOT NULL,
    "groupRimNumber" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "identificationId" INTEGER,
    "employer" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identification" (
    "id" SERIAL NOT NULL,
    "passport" TEXT,
    "driversPermit" TEXT,
    "nationalID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Identification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelegatedGroup_rimNumber_key" ON "RelegatedGroup"("rimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RelegatedGroup_generalInformationId_key" ON "RelegatedGroup"("generalInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInformation_rimNumber_key" ON "GeneralInformation"("rimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Debtor_identificationId_key" ON "Debtor"("identificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Identification_passport_key" ON "Identification"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "Identification_driversPermit_key" ON "Identification"("driversPermit");

-- CreateIndex
CREATE UNIQUE INDEX "Identification_nationalID_key" ON "Identification"("nationalID");

-- AddForeignKey
ALTER TABLE "RelegatedGroup" ADD CONSTRAINT "RelegatedGroup_generalInformationId_fkey" FOREIGN KEY ("generalInformationId") REFERENCES "GeneralInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_identificationId_fkey" FOREIGN KEY ("identificationId") REFERENCES "Identification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_groupRimNumber_fkey" FOREIGN KEY ("groupRimNumber") REFERENCES "RelegatedGroup"("rimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liability" ADD CONSTRAINT "Liability_groupRimNumber_fkey" FOREIGN KEY ("groupRimNumber") REFERENCES "RelegatedGroup"("rimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_groupRimNumber_fkey" FOREIGN KEY ("groupRimNumber") REFERENCES "RelegatedGroup"("rimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
