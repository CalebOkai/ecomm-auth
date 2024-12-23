/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_staffedStores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_parentCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropForeignKey
ALTER TABLE "_staffedStores" DROP CONSTRAINT "_staffedStores_A_fkey";

-- DropForeignKey
ALTER TABLE "_staffedStores" DROP CONSTRAINT "_staffedStores_B_fkey";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Store";

-- DropTable
DROP TABLE "Vendor";

-- DropTable
DROP TABLE "_staffedStores";

-- DropEnum
DROP TYPE "StoreStatus";

-- DropEnum
DROP TYPE "VendorType";
