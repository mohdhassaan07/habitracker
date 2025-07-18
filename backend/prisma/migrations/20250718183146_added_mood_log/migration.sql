-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('happy', 'good', 'okay', 'bad', 'terrible');

-- CreateTable
CREATE TABLE "MoodLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "mood" "Mood" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoodLog_userId_date_key" ON "MoodLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "MoodLog" ADD CONSTRAINT "MoodLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
