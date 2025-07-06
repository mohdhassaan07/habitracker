-- AlterEnum
ALTER TYPE "HabitStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "HabitLog" ADD COLUMN     "totalValue" INTEGER NOT NULL DEFAULT 0;
