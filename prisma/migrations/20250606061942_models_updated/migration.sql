/*
  Warnings:

  - The `billAmount` column on the `Shop` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalBoxes` column on the `Shop` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "billAmount",
ADD COLUMN     "billAmount" INTEGER,
DROP COLUMN "totalBoxes",
ADD COLUMN     "totalBoxes" INTEGER;
