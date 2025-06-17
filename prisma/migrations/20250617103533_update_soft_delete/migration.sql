-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "note" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
