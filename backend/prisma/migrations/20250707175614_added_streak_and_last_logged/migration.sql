-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "lastLogged" TIMESTAMP(3),
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
