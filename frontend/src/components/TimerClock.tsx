import api from '@/utils/api';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import { useHabitData } from '@/store/HabitProvider';
interface TimerClockProps {
    expiryTimestamp: Date;
    setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    habitName?: string;
    habitId?: string;
    unitValue: number;
}
const TimerClock = ({ expiryTimestamp, setIsTimerRunning, habitName, habitId, unitValue }: TimerClockProps) => {
    const {
        seconds,
        minutes,
        hours,
        days,
        // isRunning,
        pause,
        resume,
        // restart,
    } = useTimer({ expiryTimestamp, onExpire: () => { logHabit(); console.warn('onExpire called'); setIsTimerRunning(false) }, interval: 20 });
    const { updateHabitCurrentValue } = useHabitData();
    const logHabit = async () => {
        try {
            await api.post(`/habit/logHabit/${habitId}`, { sessionValue: unitValue - minutes - hours * 60 - days * 24 * 60 });
            if (habitId) {
                updateHabitCurrentValue(habitId, unitValue - minutes - hours * 60 - days * 24 * 60);
            }
        } catch (error) {
            console.error("Error logging habit:", error);

        }
    }

    return (
        <div className='flex flex-col h-screen text-center justify-center items-center'>
            <h1 className='font-bold text-3xl' >{habitName} </h1>
            <p>Timer</p>
            <div style={{ fontSize: '100px' }}>
                <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <div className='flex gap-2  ' >
                <button className=' p-1 px-2 border-2 text-white bg-blue-600 rounded-lg' onClick={() => {
                    pause();
                    logHabit(); setIsTimerRunning(false)
                }}>Stop</button>
                <button className=' p-1 px-2 border-2 border-blue-600 rounded-lg' onClick={pause}>Pause</button>
                <button className=' p-1 px-2 border-2 border-blue-600 rounded-lg' onClick={resume}>Resume</button>
                {/* <button className=' p-1 px-2 border-2 border-blue-600 rounded-lg' onClick={() => {

                        restart(expiryTimestamp)
                    }}>Restart</button> */}
            </div>

        </div>
    )
}

export default TimerClock
