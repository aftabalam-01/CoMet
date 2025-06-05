/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "billAmount" TEXT,
ADD COLUMN     "totalBoxes" TEXT,
ALTER COLUMN "contactPerson" DROP NOT NULL,
ALTER COLUMN "contactPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
