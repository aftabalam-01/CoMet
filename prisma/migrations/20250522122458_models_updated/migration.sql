/*
  Warnings:

  - Added the required column `createdById` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Transport` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
