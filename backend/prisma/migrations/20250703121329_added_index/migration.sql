-- CreateIndex
CREATE INDEX "Habit_id_userId_createdAt_idx" ON "Habit"("id", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "HabitLog_id_habitId_idx" ON "HabitLog"("id", "habitId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
