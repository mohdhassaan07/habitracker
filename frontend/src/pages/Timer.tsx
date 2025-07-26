import { TimerIcon } from "lucide-react"
import { useSelector } from 'react-redux'
import { useParams,useNavigate } from "react-router-dom"
import { useHabitData } from "@/store/HabitProvider"
import { useState, useEffect } from "react"
import TimerClock from "@/components/TimerClock"
const Timer = () => {
  const [habit, setHabit] = useState<any>({});
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();
  const { habitData, fetchHabitData } = useHabitData();
  const [formData, setformData] = useState({
    sessionValue: 1
  })
  useEffect(() => {
    fetchHabitData();
    const foundHabit = habitData.find((h: any) => h.id === habitId);
    if (foundHabit) {
      setHabit(foundHabit);
      setformData({ sessionValue: foundHabit.unitValue-foundHabit.currentValue });
    }
  }, [habitId, habitData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: name === 'sessionValue' ? parseInt(value) : value,
    })
  }

  const time = new Date();
  time.setSeconds(time.getSeconds() + formData.sessionValue * 60)

  return (
    <>
      {(currentUser && !isTimerRunning ) && (
        <div className="w-full gap-3 flex h-screen justify-center items-center" >
          <div>
            <TimerIcon className="w-36 h-36 text-gray-600" />
          </div>
          <div className="flex-col justify-center items-center " >
            <h1 className="text-3xl font-semibold text-gray-600">Timer</h1>
            <p className="mt-4 text-sm" >select your duration for this session</p>
            <input className="border text-sm border-gray-400 w-48 my-2 rounded-md p-1" onChange={handleChange} min={1} max={habit.unitValue} value={formData.sessionValue} type="number" name="sessionValue" id="" />
            <div>
              <button onClick={()=> formData.sessionValue > habit.unitValue ? alert("value exceeded") :setIsTimerRunning(true)} className="bg-blue-600 text-white text-sm rounded-md p-1 px-3 hover:bg-blue-700 transition duration-200" >Start Session</button>
              <button className="rounded-md border text-sm mx-2 p-1 px-3 transition duration-200" onClick={()=>navigate(-1)}>Cancel</button>
            </div>
          </div>
        </div>
      )
      }
      {currentUser && isTimerRunning && (
        <TimerClock habitName={habit.name} unitValue={formData.sessionValue} habitId={habitId} expiryTimestamp={time} setIsTimerRunning={setIsTimerRunning} />
      )}
    </>
  )
}

export default Timer
