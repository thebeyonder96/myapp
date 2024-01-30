/*
  Warnings:

  - You are about to drop the column `descriptions` on the `Password` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "descriptions",
ADD COLUMN     "description" TEXT;
