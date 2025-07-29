import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { differenceInCalendarDays } from 'date-fns';
// const timeOfDay = async () => {
//   await prisma.timeOfDay.createMany({
//     data: [
//       { label: 'Morning' },
//       { label: 'Afternoon' },
//       { label: 'Evening' }
//     ],
//     skipDuplicates: true
//   });
//   console.log("Time of day records created");
// }
// timeOfDay();

const getHabits = async (req, res) => {
  const { userId } = req.params;
  const time = req.query.time;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    if (time) {
      const habits = await prisma.habit.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          userId: userId,
          timeOfDay: {
            some: {
              label: time
            }
          }
        },
        include: {
          timeOfDay: true,
          logs: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
      });
      return res.status(200).json({ habits: habits });
    }

    const habits = await prisma.habit.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        userId: userId,
      },
      include: {
        timeOfDay: true,
        logs: {
          orderBy: {
            createdAt: 'asc'
          }
        },
      },
    });
    return res.status(200).json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createHabit = async (req, res) => {
  let { name, unitType, unitValue, frequency, timeOfDay } = req.body;
  if (!name || !unitType || !unitValue || !frequency) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!timeOfDay || timeOfDay.length === 0) {
    timeOfDay = ["Morning", "Afternoon", "Evening"]; // Default values
  }

  try {
    let userId = req.user.id;

    const timeOfDayRecords = await prisma.timeOfDay.findMany({
      where: {
        label: {
          in: timeOfDay, // e.g., ["morning", "evening"]
        },
      },
    });
    console.log(timeOfDayRecords);

    const habit = await prisma.habit.create({
      data: {
        name,
        unitType,
        unitValue,
        frequency,
        userId,
        timeOfDay: {
          connect: timeOfDayRecords.map(r => ({ id: r.id }))
        }
      }
    })
    console.log(habit);
    return res.status(200).json(habit);

  } catch (error) {
    console.error("Error creating habit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const editHabit = async (req, res) => {
  let { unitType, unitValue, frequency, timeOfDay } = req.body
  let habitId = req.params.id
  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId
      }
    })

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const timeOfDayRecords = await prisma.timeOfDay.findMany({
      where: {
        label: {
          in: timeOfDay, // e.g., ["Morning", "Evening"]
        },
      },
    });

    const editHabit = await prisma.habit.update({
      where: {
        id: habitId
      },
      data: {
        unitType,
        unitValue,
        frequency,
        timeOfDay: { set: timeOfDayRecords.map(r => ({ id: r.id })) }
      }
    })
    console.log(editHabit);
    return res.status(200).json({ editHabit, message: "Habit updated successfully" });
  } catch (error) {
    console.error("Error editing habit:", error)
    res.status(500).json({ error: "error updating habit!" });
  }
}

const logHabit = async (req, res) => {
  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id: req.params.id
      }
    })
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (habit.currentValue >= habit.unitValue) {
      return res.status(400).json({ error: "Current value exceeds unit value" });
    }

    async function updateHabitStreak(habitId: string, logDate: Date) {
      const habit = await prisma.habit.findUnique({ where: { id: habitId } });

      if (!habit) return;

      const lastDate = habit.lastLogged;
      const todayDate = new Date(Date.UTC(
        logDate.getUTCFullYear(),
        logDate.getUTCMonth(),
        logDate.getUTCDate()
      ));

      let newStreak = 1;

      if (lastDate) {
        const last = new Date(Date.UTC(
          lastDate.getUTCFullYear(),
          lastDate.getUTCMonth(),
          lastDate.getUTCDate()
        ));

        const dayDiff = differenceInCalendarDays(todayDate, last);

        if (dayDiff === 1) {
          // continued streak
          newStreak = habit.streak + 1;
        } else if (dayDiff === 0) {
          // already logged today — don't change streak
          newStreak = habit.streak + 1;
        } else {
          // missed a day
          newStreak = 1;
        }
      }

      await prisma.habit.update({
        where: { id: habitId },
        data: {
          streak: newStreak,
          lastLogged: todayDate,
        },
      });
    }

    const now = new Date();
    const date = new Date(Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ));

    if (req.query.status && habit.currentValue != habit.unitValue) {
      // If a status is provided, update the habit log
      if (req.query.status === "completed") {
        let logHabit = await prisma.habitLog.upsert({
          where: {
            habitId_date: { habitId: req.params.id, date: date },
          },
          update: {
            status: req.query.status,
            totalValue: habit.unitValue
          },
          create: {
            habitId: req.params.id,
            date: date,
            totalValue: habit.unitValue,
            status: req.query.status
          }
        })
        // If the status is completed, increment the current value
        await prisma.habit.update({
          where: {
            id: req.params.id
          },
          data: {
            currentValue: {
              set: habit.unitValue
            },
            totalValue: {
              increment: habit.unitValue - habit.currentValue
            }
          }
        })
        await updateHabitStreak(habit.id, date);
        return res.status(200).json({ message: "Habit logged successfully", logHabit });
      }
      if (req.query.status === "failed") {
        let logHabit = await prisma.habitLog.upsert({
          where: {
            habitId_date: { habitId: req.params.id, date: date },
          },
          update: {
            status: req.query.status,
            totalValue: 0
          },
          create: {
            habitId: req.params.id,
            date: date,
            totalValue: 0,
            status: req.query.status
          }
        })
        await prisma.habit.update({
          where: {
            id: req.params.id
          },
          data: {
            currentValue: {
              set: 0
            },
            totalValue: {
              decrement: habit.currentValue
            }
          }
        })
        return res.status(200).json({ message: "Habit logged successfully", logHabit });
      }

      if (req.query.status === "skipped") {
        let logHabit = await prisma.habitLog.upsert({
          where: {
            habitId_date: { habitId: req.params.id, date: date },
          },
          update: {
            status: req.query.status,
            totalValue: habit.currentValue
          },
          create: {
            habitId: req.params.id,
            date: date,
            totalValue: habit.currentValue,
            status: req.query.status
          }
        })
        await prisma.habit.update({
          where: {
            id: req.params.id
          },
          data: {
            currentValue: {
              set: 0
            },
            totalValue: {
              increment: habit.currentValue
            }
          }
        })
        return res.status(200).json({ message: "Habit logged successfully", logHabit });
      }

    }

    // Increment the current value of the habit
    if (habit.unitType === "times") {

      if (habit.currentValue === habit.unitValue - 1) {
        let addValue = await prisma.habit.update({
          where: {
            id: req.params.id
          },
          data: {
            currentValue: {
              increment: 1
            },
            totalValue: {
              increment: 1
            }
          }
        })
        console.log(addValue);
        // If the current value reaches the unit value, log the habit as completed

        let logHabit = await prisma.habitLog.upsert({
          where: {
            habitId_date: { habitId: req.params.id, date: date },
          },
          update: {
            status: "completed",
            totalValue: habit.unitValue
          },
          create: {
            habitId: req.params.id,
            date: date,
            totalValue: habit.unitValue,
            status: "completed"
          }
        })
        await updateHabitStreak(habit.id, date);
        return res.status(200).json({ message: "Habit logged in successfully", logHabit });
      }

      let addValue = await prisma.habit.update({
        where: {
          id: req.params.id
        },
        data: {
          currentValue: {
            increment: 1
          },
          totalValue: {
            increment: 1
          }
        }
      })
      const logged = await prisma.habitLog.upsert({
        where: {
          habitId_date: { habitId: req.params.id, date: date }
        },
        update: {
          status: "pending",
          totalValue: habit.currentValue + 1
        },
        create: {
          date: date,
          habitId: req.params.id,
          status: "pending",
          totalValue: habit.currentValue + 1
        }
      })
      console.log(addValue);
      return res.status(200).json({ message: "Habit logged successfully", addValue, "loggedhabit": logged });
    }

    if (habit.unitType === "minutes") {
      const { sessionValue } = req.body;
      if (!sessionValue || sessionValue <= 0) {
        return res.status(400).json({ error: "Session value is required and must be greater than 0" });
      }
      const loggedHabit = await prisma.habit.update({
        where: {
          id: req.params.id
        },
        data: {
          currentValue: {
            increment: sessionValue
          },
          totalValue: habit.totalValue + sessionValue
        }
      })
      console.log(loggedHabit);
      const logged = await prisma.habitLog.upsert({
        where: {
          habitId_date: { habitId: req.params.id, date: date }
        },
        update: {
          status: "pending",
          totalValue: habit.currentValue + sessionValue
        },
        create: {
          date: date,
          habitId: req.params.id,
          status: "pending",
          totalValue: habit.currentValue + sessionValue
        }
      })
      if (loggedHabit.currentValue >= loggedHabit.unitValue) {
        let logHabit = await prisma.habitLog.upsert({
          where: {
            habitId_date: { habitId: req.params.id, date: date }
          },
          update: {
            status: "completed",
            totalValue: habit.currentValue + sessionValue
          },
          create: {
            date: date,
            habitId: req.params.id,
            status: "completed",
            totalValue: habit.currentValue + sessionValue
          }
        })
        await updateHabitStreak(habit.id, date);
        return res.status(200).json({ message: "Habit logged successfully", logHabit });
      }
      return res.status(200).json({ message: "Habit logged successfully", loggedHabit, "log": logged });
    }

  } catch (error) {
    console.error("Error logging habit:", error);
    res.status(500).json({ error: "Error Logging Habit" });
  }
}

const undoLog = async (req, res) => {
  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id: req.params.habitId
      }
    })
    if (!habit) return res.status(400).json({ message: "habit not found" })
    await prisma.habit.update({
      where: {
        id: req.params.habitId
      },
      data: {
        totalValue: habit.totalValue - habit.currentValue,
        currentValue: { set: 0 },
        lastLogged: null,
        streak: {
          decrement: 1
        }
      }
    })
    const deletedLog = await prisma.habitLog.delete({
      where: {
        id: req.params.logId,
        habitId: req.params.habitId
      }
    })

    return res.status(200).json({ message: "undo done", deletedLog })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Error deleting Habit", error });
  }
}

const deleteHabit = async (req, res) => {
  try {
    await prisma.habitLog.deleteMany({
      where: {
        habitId: req.params.id
      }
    })
    const habit = await prisma.habit.delete({
      where: {
        id: req.params.id
      },
    })
    console.log("habit deleted", habit)
    return res.status(200).json({ message: "habit deleted successfully", habit })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Error deleting Habit", error });
  }
}

const getLoggedData = async (req, res) => {
  try {
    const groupedLogs = await prisma.habitLog.groupBy({
      by: ['status'],
      where: {
        habitId: req.params.habitId
      },
      _count: {
        status: true
      }
    });
    const groupedByDate = await prisma.habitLog.findMany({
      where: {
        habitId: req.params.habitId
      },
      orderBy : {
        date: 'asc'
      }
    })
    return res.status(200).json({ groupedLogs, groupedByDate });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching logged data", error });
  }
}

const searchData = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const habits = await prisma.habit.findMany(
      {
        where: {
          userId: userId,
          name: {
            contains: query,
            mode: 'insensitive' // Case-insensitive search
          }
        },
        include: {
          timeOfDay: true,
          logs: true
        }
      })
    if (habits.length === 0) {
      return res.status(404).json({ message: "No habits found" });
    }
    console.log("Search results:", habits);
    return res.status(200).json({ "habits": habits, query });
  } catch (error) {
    console.error("Error searching habits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const resetHabits = async (req, res) => {
  try {
    const userId = req.params.userId;
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.habit.updateMany({
      where: {
        userId: userId
      },
      data: {
        currentValue: 0,
        totalValue: 0,
        lastLogged: null,
        streak: 0
      }
    });
    await prisma.habitLog.deleteMany({
      where: {
        habit: {
          userId: userId
        }
      }
    });
    return res.status(200).json({ message: "All habits reset successfully" });
  } catch (error) {
    console.error("Error resetting habits:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const deleteAllData = async (req, res) => {
  const userId = req.params.userId
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.habitLog.deleteMany({
      where: {
        habit: {
          userId: userId
        }
      }
    })
    await prisma.habit.deleteMany({
      where: {
        userId: userId
      }
    })
    return res.status(200).json({ message: "Data deleted successfully!" })
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getHabits,
  editHabit,
  createHabit,
  logHabit,
  deleteHabit,
  undoLog,
  getLoggedData,
  searchData,
  resetHabits,
  deleteAllData
}