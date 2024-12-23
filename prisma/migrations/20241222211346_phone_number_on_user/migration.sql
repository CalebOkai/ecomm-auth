/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LoginAttempt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `LoginAttempt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `emailVerifiedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerifiedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `setAddressAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `setPasswordAt` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "LoginAttempt" DROP CONSTRAINT "LoginAttempt_deviceId_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Device_id_seq";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "deviceId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LoginAttempt" DROP CONSTRAINT "LoginAttempt_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "deviceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "emailVerifiedAt",
DROP COLUMN "phoneVerifiedAt",
DROP COLUMN "setAddressAt",
DROP COLUMN "setPasswordAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "verifiedById" TEXT;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
