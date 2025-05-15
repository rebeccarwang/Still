-- CreateEnum
CREATE TYPE "ReflectionPreference" AS ENUM ('weekly', 'biweekly', 'monthly');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "reflectionPref" "ReflectionPreference" NOT NULL DEFAULT 'weekly',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sentimentScore" DOUBLE PRECISION,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryTagMap" (
    "entryId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "EntryTagMap_pkey" PRIMARY KEY ("entryId","tagId")
);

-- CreateTable
CREATE TABLE "MoodCheckIn" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moodScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopingStrategy" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CopingStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCopingStrategy" (
    "userId" INTEGER NOT NULL,
    "strategyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCopingStrategy_pkey" PRIMARY KEY ("userId","strategyId")
);

-- CreateTable
CREATE TABLE "SelfCare" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfCare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSelfCare" (
    "userId" INTEGER NOT NULL,
    "selfCareId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSelfCare_pkey" PRIMARY KEY ("userId","selfCareId")
);

-- CreateTable
CREATE TABLE "SelfAffirmation" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfAffirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSelfAffirmation" (
    "userId" INTEGER NOT NULL,
    "selfAffirmationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSelfAffirmation_pkey" PRIMARY KEY ("userId","selfAffirmationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryTagMap" ADD CONSTRAINT "EntryTagMap_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryTagMap" ADD CONSTRAINT "EntryTagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodCheckIn" ADD CONSTRAINT "MoodCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopingStrategy" ADD CONSTRAINT "CopingStrategy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCopingStrategy" ADD CONSTRAINT "UserCopingStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCopingStrategy" ADD CONSTRAINT "UserCopingStrategy_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "CopingStrategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfCare" ADD CONSTRAINT "SelfCare_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSelfCare" ADD CONSTRAINT "UserSelfCare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSelfCare" ADD CONSTRAINT "UserSelfCare_selfCareId_fkey" FOREIGN KEY ("selfCareId") REFERENCES "SelfCare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfAffirmation" ADD CONSTRAINT "SelfAffirmation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSelfAffirmation" ADD CONSTRAINT "UserSelfAffirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSelfAffirmation" ADD CONSTRAINT "UserSelfAffirmation_selfAffirmationId_fkey" FOREIGN KEY ("selfAffirmationId") REFERENCES "SelfAffirmation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
