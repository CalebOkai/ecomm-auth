/*
  Warnings:

  - Made the column `deviceId` on table `LoginAttempt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LoginAttempt" DROP CONSTRAINT "LoginAttempt_deviceId_fkey";

-- AlterTable
ALTER TABLE "LoginAttempt" ALTER COLUMN "deviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
