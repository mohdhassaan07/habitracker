import React, { createContext, useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { useTimeOfDay } from './TimeofDay.tsx';

interface JournalDataContextType {
  habitData: any[];
  timeOfDayData: any[];
  searchHabits: any[];
  setsearchHabits: React.Dispatch<React.SetStateAction<any[]>>;
  fetchHabitData: (sortOrder?: string) => Promise<void>;
  fetchTimeOfDayData: () => Promise<void>;
  updateHabitValue: any;
  updateHabitCurrentValue: (habitId: string, increment: number) => void;
  updateHabits: (habitId: string) => void;
  loading: boolean;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setquery: React.Dispatch<React.SetStateAction<string>>;
  removeData: () => void;
  resetData: () => void;
}

const HabitDataContext = createContext<JournalDataContextType | undefined>(undefined);

const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habitData, setHabitData] = useState<any>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<any>([]);
  const [loading, setloading] = useState(false);
  const [searchHabits, setsearchHabits] = useState<any>([])
  const [query, setquery] = useState("")
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const { time } = useTimeOfDay();
  const hasFetchedRef = useRef(false);
  const hasFetchedTimeRef = useRef(false);

  const fetchHabitData = async () => {
    try {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;
      setloading(true)
      let res = await api.get(`/habit/${currentUser.id}`)
      setHabitData(res.data)
      console.log("Habit data fetched:", res.data);

    } catch (err) {
      console.error("Failed to fetch habits", err);
    } finally {
      setloading(false)
    }
  }

  const fetchTimeOfDayData = async () => {
    try {
      if (hasFetchedTimeRef.current) return;
      hasFetchedTimeRef.current = true;
      setloading(true);
      let res = await api.get(`/habit/${currentUser.id}?time=${time}`);
      if (res.status === 200) {
        console.log("Time of day habits fetched:", res.data.habits);
        setTimeOfDayData(res.data.habits);
      }
    } catch (err) {
      console.error("Failed to fetch time of day habits", err);
    } finally {
      setloading(false);
    }
  }

  const updateHabits = (habitId: string) => {
    let newdata = habitData.filter((h: any) => h.id !== habitId)
    setHabitData(newdata)
  }

  const updateHabitValue = (habitId: string, unitValue?: number, increment: number = 1) => {
    if (unitValue) {
      setHabitData((prev: any[]) =>
        prev.map(habit =>
          habit.id === habitId
            ? { ...habit, unitValue: unitValue }
            : habit
        )
      );
      return;
    }
    else {
      setHabitData((prev: any[]) =>
        prev.map(habit =>
          habit.id === habitId
            ? habit.currentValue === habit.unitValue - 1 ? { ...habit, currentValue: habit.currentValue + increment, logs: [...(Array.isArray(habit.logs) ? habit.logs : []), { date: new Date().toISOString(), status: 'completed' }] }
              : { ...habit, currentValue: habit.currentValue + increment }
            : habit
        )
      );
    }
  };

  const updateHabitCurrentValue = (habitId: string, increment: number) => {
    setHabitData((prev: any[]) =>
      prev.map(habit =>
        habit.id === habitId
          ? habit.currentValue === habit.unitValue ? { ...habit, currentValue: habit.currentValue + increment, logs: [...(Array.isArray(habit.logs) ? habit.logs : []), { date: new Date().toISOString(), status: 'completed' }] }
            : { ...habit, currentValue: habit.currentValue + increment }
          : habit
      )
    );
  }

  const removeData = () => {
    setHabitData([]);
    setTimeOfDayData([]);
  }

  const resetData = () => {
    setHabitData((prevHabits : any[]) =>
      prevHabits.map((habit: any) => ({
        ...habit,
        currentValue: 0,
        logs: [],
      }))
    );
    setTimeOfDayData((prevHabits: any[]) =>
    prevHabits.map((habit: any) => ({
      ...habit,
      currentValue: 0,
      logs: [],
    }))
  );
  }

  return (
    <HabitDataContext.Provider value={{
      habitData, fetchHabitData, timeOfDayData, fetchTimeOfDayData,
      loading, setloading, updateHabitValue, updateHabitCurrentValue,
      updateHabits, searchHabits, setsearchHabits, query, setquery, removeData, resetData
    }}>
      {children}
    </HabitDataContext.Provider>
  );
};

const useHabitData = () => {
  const context = useContext(HabitDataContext);
  if (!context) {
    throw new Error("useHabitData must be used within a HabitProvider");
  }
  return context;
};

export { HabitProvider, useHabitData };