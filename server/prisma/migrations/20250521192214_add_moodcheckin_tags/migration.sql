-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "moodAtTimeOfEntry" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "MoodCheckInTagMap" (
    "moodCheckInId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "MoodCheckInTagMap_pkey" PRIMARY KEY ("moodCheckInId","tagId")
);

-- AddForeignKey
ALTER TABLE "MoodCheckInTagMap" ADD CONSTRAINT "MoodCheckInTagMap_moodCheckInId_fkey" FOREIGN KEY ("moodCheckInId") REFERENCES "MoodCheckIn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodCheckInTagMap" ADD CONSTRAINT "MoodCheckInTagMap_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
