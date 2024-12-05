/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_sessionId_key" ON "Vendor"("sessionId");
