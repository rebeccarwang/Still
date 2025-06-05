/*
  Warnings:

  - A unique constraint covering the columns `[createdById,content]` on the table `CopingStrategy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdById,content]` on the table `SelfAffirmation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdById,content]` on the table `SelfCare` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CopingStrategy_createdById_content_key" ON "CopingStrategy"("createdById", "content");

-- CreateIndex
CREATE UNIQUE INDEX "SelfAffirmation_createdById_content_key" ON "SelfAffirmation"("createdById", "content");

-- CreateIndex
CREATE UNIQUE INDEX "SelfCare_createdById_content_key" ON "SelfCare"("createdById", "content");
