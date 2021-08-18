/*
  Warnings:

  - A unique constraint covering the columns `[shopId]` on the table `StoreSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `StoreSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreSession" ADD COLUMN     "shopId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoreSession.shopId_unique" ON "StoreSession"("shopId");
