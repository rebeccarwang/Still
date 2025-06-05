/*
  Warnings:

  - A unique constraint covering the columns `[userId,strategyId]` on the table `UserCopingStrategy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,selfAffirmationId]` on the table `UserSelfAffirmation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,selfCareId]` on the table `UserSelfCare` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCopingStrategy_userId_strategyId_key" ON "UserCopingStrategy"("userId", "strategyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSelfAffirmation_userId_selfAffirmationId_key" ON "UserSelfAffirmation"("userId", "selfAffirmationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSelfCare_userId_selfCareId_key" ON "UserSelfCare"("userId", "selfCareId");
