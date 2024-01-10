/*
  Warnings:

  - You are about to drop the column `title` on the `Password` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Password" DROP COLUMN "title",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "username" TEXT;
