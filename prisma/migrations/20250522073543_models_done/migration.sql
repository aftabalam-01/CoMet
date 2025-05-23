-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactPhone" INTEGER NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "boxes" INTEGER NOT NULL,
    "billno" INTEGER NOT NULL,
    "transportId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
