/*
  Warnings:

  - A unique constraint covering the columns `[shopId]` on the table `store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store" ADD COLUMN     "shopId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store.shopId_unique" ON "store"("shopId");
