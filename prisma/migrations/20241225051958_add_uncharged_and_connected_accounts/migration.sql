-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "connectedGroupId" TEXT,
ADD COLUMN     "unchargedGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_unchargedGroupId_fkey" FOREIGN KEY ("unchargedGroupId") REFERENCES "RelegatedGroup"("rimNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_connectedGroupId_fkey" FOREIGN KEY ("connectedGroupId") REFERENCES "RelegatedGroup"("rimNumber") ON DELETE SET NULL ON UPDATE CASCADE;
