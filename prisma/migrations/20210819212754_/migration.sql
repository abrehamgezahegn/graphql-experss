/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User.firebaseUserId_unique" ON "User"("firebaseUserId");
