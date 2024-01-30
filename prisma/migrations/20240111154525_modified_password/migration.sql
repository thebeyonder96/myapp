/*
  Warnings:

  - You are about to drop the column `userId` on the `Password` table. All the data in the column will be lost.
  - Added the required column `siteId` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- AlterTable
ALTER TABLE "Password" DROP COLUMN "userId",
ADD COLUMN     "siteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
