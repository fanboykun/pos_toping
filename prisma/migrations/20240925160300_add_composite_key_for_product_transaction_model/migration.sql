/*
  Warnings:

  - A unique constraint covering the columns `[productId,transactionId]` on the table `ProductTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProductTransaction_productId_transactionId_key` ON `ProductTransaction`(`productId`, `transactionId`);
