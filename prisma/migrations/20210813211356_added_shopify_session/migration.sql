-- CreateTable
CREATE TABLE "StoreSession" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreSession.id_unique" ON "StoreSession"("id");
