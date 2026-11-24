-- CreateEnum
CREATE TYPE "PictureStatus" AS ENUM ('PENDING', 'READY');

-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER,
    "status" "PictureStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Picture_key_key" ON "Picture"("key");

-- CreateIndex
CREATE INDEX "Picture_status_createdAt_idx" ON "Picture"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Category_pictureId_idx" ON "Category"("pictureId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

