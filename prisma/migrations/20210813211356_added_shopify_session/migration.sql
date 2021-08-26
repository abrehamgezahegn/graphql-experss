-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "store.id_unique" ON "store"("id");
