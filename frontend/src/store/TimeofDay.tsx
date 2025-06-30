import { createContext, useContext, useEffect, useState } from "react";

export interface TimeOfDayContextType {
    time: string;
}
export const TimeOfDayContext = createContext<TimeOfDayContextType | undefined>(undefined);

export const TimeOfDayProvider = ({ children }: { children: React.ReactNode }) => {
    const [time, settime] = useState('')
    useEffect(() => {
        const hour = new Date().getHours()
        if (hour >= 0 && hour < 12) {
            settime('Morning')
        } else if (hour >= 12 && hour < 18) {
            settime('Afternoon')
        } else {
            settime('Evening')
        }
    }, [])

    return (
        <TimeOfDayContext.Provider value={{ time }}>
            {children}
        </TimeOfDayContext.Provider>
    )
};

export const useTimeOfDay = (): TimeOfDayContextType => {
  const context = useContext(TimeOfDayContext);
  if (!context) {
    throw new Error("useTimeOfDay must be used within a TimeOfDayProvider");
  }
  return context;
}