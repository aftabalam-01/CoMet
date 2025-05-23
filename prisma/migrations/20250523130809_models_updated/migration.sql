/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - Added the required column `note` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "note" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ALTER COLUMN "phone" SET DATA TYPE BIGINT;
