import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const resetallHabits = async (req, res) => {
    const today = new Date()
    const habits = await prisma.habit.findMany()

    for (const habit of habits) {
        let shouldReset = false
        if (habit.frequency === 'daily') {
            shouldReset = true
        }
        else if (habit.frequency === 'weekly') {
            shouldReset = today.getDay() === habit.createdAt.getDay()
        }
        else if (habit.frequency === 'monthly') {
            shouldReset = today.getDate() === habit.createdAt.getDate()
        }
        else {
            console.error(`Unknown frequency: ${habit.frequency} for habit ${habit.id}`);
            continue
        }

        if (shouldReset) {
            await prisma.habit.update({
                where: { id: habit.id },
                data: {
                    currentValue: 0,
                }
            })
        }
    }
    console.log('✅ Habit progress reset:', today);
    return res.status(200).json('Habits reset successfully');
}

// export const resetallHabits = async (req,res) => {
//     console.log('🔥 resetallHabits triggered');
//     await resetHabits();
//     res.status(200).send('Habits reset successfully');
// }

// resetHabits()
// cron.schedule('0 0 * * *', () => {
//   resetHabits().catch((err) => {
//     console.error('❌ Error resetting habits:', err);
//   });
// });