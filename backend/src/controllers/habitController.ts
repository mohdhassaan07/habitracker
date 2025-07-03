import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
          logs: true
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
        logs: true,
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

    if (req.query.status && habit.currentValue != habit.unitValue) {
      // If a status is provided, update the habit log
      let date = new Date();
      let logHabit = await prisma.habitLog.create({
        data: {
          date: date.toISOString(),
          habitId: req.params.id,
          status: req.query.status
        }
      })
      if (req.query.status === "completed") {
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
      }
      if (req.query.status === "failed") {
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
      }
      return res.status(200).json({ message: "Habit logged successfully", logHabit });
    }

    if (habit.currentValue >= habit.unitValue) {
      return res.status(400).json({ error: "Current value exceeds unit value" });
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
        let date = new Date();
        let logHabit = await prisma.habitLog.create({
          data: {
            date: date.toISOString(),
            habitId: req.params.id,
            status: "completed"
          }
        })
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
      console.log(addValue);
      return res.status(200).json({ message: "Habit logged successfully", addValue });
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
      if (loggedHabit.currentValue >= loggedHabit.unitValue) {
        let date = new Date();
        let logHabit = await prisma.habitLog.create({
          data: {
            date: date.toISOString(),
            habitId: req.params.id,
            status: "completed"
          }
        })
        // Reset current value to 0 after logging
        return res.status(200).json({ message: "Habit logged successfully", logHabit });
      }
      return res.status(200).json({ message: "Habit logged successfully", loggedHabit });
    }

  } catch (error) {
    console.error("Error logging habit:", error);
    res.status(500).json({ error: "Error Logging Habit" });
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
    console.log("habit deleted",habit)
    return res.status(200).json({ message: "habit deleted successfully", habit })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Error deleting Habit", error });
  }
}

export {
  getHabits,
  editHabit,
  createHabit,
  logHabit,
  deleteHabit
}