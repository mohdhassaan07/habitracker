import { useState, useEffect } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Header from "./Header"
import { useSelector } from 'react-redux'
import { ChevronDown, Plus, EllipsisVertical, ArrowRight, Check, X, Pencil, Undo, Timer } from "lucide-react"
import '../App.css'
import RightSidebar from "../components/RightSidebar";
import { useHabitData } from '@/store/HabitProvider'
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import EditHabit from './EditHabit'
import { Link } from 'react-router-dom'

const Habits = (props: any) => {
  const [toggleRightSidebar, settoggleRightSidebar] = useState(false)
  const { timeOfDayData: initialTimeOfDayData, fetchTimeOfDayData, loading, updateHabitValue } = useHabitData();
  const [habitId, sethabitId] = useState("")
  const [disabled, setdisabled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tohabit, settohabit] = useState<any>({})
  type Status = 'completed' | 'skipped' | 'failed' | 'pending';
  const [openGroups, setOpenGroups] = useState<{ [key in Status]: boolean }>({
    completed: false,
    skipped: false,
    failed: false,
    pending: true,
  });
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [habitData, sethabitData] = useState<any[]>([])
  useEffect(() => {
    const getData = async () => {
      try {
        fetchTimeOfDayData()
      } catch (err) {
        console.error("Failed to fetch habits", err);
      }
    }
    getData()
  }, [])

  useEffect(() => {
    sethabitData(initialTimeOfDayData)
  }, [initialTimeOfDayData])


  const today = new Date();
  const isSamePeriod = (logDate: string, habit: any): boolean => {
    const log = new Date(logDate);
    switch (habit.frequency) {
      case "daily":
        return log.toDateString() === today.toDateString()
      case "weekly":
        const startOfWeek = new Date(log);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return today >= startOfWeek && today <= endOfWeek;
      case "monthly":
        const startOfMonth = new Date(log);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setDate(endOfMonth.getDate() + 30);
        return today >= startOfMonth && today <= endOfMonth;

      default:
        return false;
    }
  };

  const toggleGroup = (group: Status) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const getHabitStatus = (habit: any) => {
    const logs = habit.logs;
    const lastLog = logs && logs.length > 0 ? logs[logs.length - 1] : null;
    if (lastLog && isSamePeriod(lastLog.date, habit)) {
      return lastLog.status;
    }
    return 'pending';
  };

  const logHabit = async (habitId: any) => {
    try {
      setdisabled(true)
      let res = await api.post(`/habit/logHabit/${habitId}`)
      updateHabitValue(habitId)
      if (res.status === 200) {
        toast.success('Habit logged successfully!')
      }
      console.log(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Error logging habit!')
    } finally {
      setdisabled(false)
    }
  }
  const finalLogHabit = async (habitId: any, status: Status) => {
    try {
      setdisabled(true)
      let res = await api.post(`/habit/logHabit/${habitId}?status=${status}`)
      if (res.status === 200) {

        sethabitData((prev) =>
          prev.map((habit) => {
            if (habit.id !== habitId) return habit;
            let safeLogs = Array.isArray(habit.logs) ? habit.logs : [];
            if (status === "completed") return { ...habit, currentValue: habit.unitValue, logs: [...safeLogs, { date: new Date().toISOString(), status: status }] }
            return { ...habit, currentValue: 0, logs: [...safeLogs, { date: new Date().toISOString(), status: status }] }
          })
        )

        setOpenGroups((prev) => ({
          ...prev,
          [status]: true,
        }));

        if (status === 'completed') {
          toast.success('Habit completed successfully!')
        } else if (status === 'skipped') {
          toast.success('Habit skipped!')
        } else if (status === 'failed') {
          toast.error('Habit failed!')
        }
      }
      console.log(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Error logging habit!')
    }
    finally {
      setdisabled(false)
    }
  }

  const undoLog = async (habitId: any, logId: any) => {
    try {
      setdisabled(true)
      let res = await api.delete(`/habit/undoLog/${habitId}/${logId}`)
      if (res.status === 200) {
        sethabitData((prev) =>
          prev.map((habit) => {
            if (habit.id !== habitId) return habit;
            return { ...habit, logs: habit.logs.filter((log: any) => log.id !== logId) }
          })
        )
        toast.success('Habit log undone successfully!')
      }
      console.log(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Error undoing habit log!')
    } finally {
      setdisabled(false)
    }
  }

  // const checkDisabled = (habit: any) => {
  //   const lastLog = habit.logs && habit.logs.length > 0 ? habit.logs[habit.logs.length - 1] : null;
  //   if (lastLog.date.getHours()+5 > today.getHours()) {
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  const getHabitColor = (status: Status) => {
    switch (status) {
      case 'completed':
        return 'border-green-300';
      case 'skipped':
        return 'border-yellow-300';
      case 'failed':
        return 'border-red-300';
      default:
        return 'border-white';
    }
  }

  const statusGroups: { [key in Status]: any[] } = {
    completed: [],
    skipped: [],
    failed: [],
    pending: [],
  };
  const renderOrder: Status[] = ['completed', 'skipped', 'failed'];

  habitData.forEach((habit: any) => {
    const status = getHabitStatus(habit) as Status;
    statusGroups[status].push(habit)
  });

  if (loading) {
    return <div className="w-full flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  }
  return (
    <>
      {currentUser && (
        <div className="w-full bg-white m-2 rounded-2xl max-h-screen">
          <EditHabit isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} habitId={habitId} />
          <Header />
          <div className="element px-4 py-4 h-[90.5vh] overflow-y-auto">
            <div className="flex justify-between ">
              <h2 className="text-xl font-bold mb-4">{props.tab}</h2>

            </div>

            {renderOrder.map((status) =>
              statusGroups[status].length > 0 ? (
                <div key={status} className="mb-6">
                  <div
                    className="flex justify-between items-center gap-2 p-2 rounded-md cursor-pointer"
                    onClick={() => toggleGroup(status)}
                  >
                    <h3 className="text-md text-gray-600 capitalize">
                      {status === 'pending'
                        ? ''
                        : status === 'completed'
                          ? 'Completed'
                          : status === 'skipped'
                            ? 'Skipped'
                            : 'Failed'}
                    </h3>
                    <div className="line bg-gray-400 w-full h-[0.5px] "></div>
                    <ChevronDown
                      className={`transition-transform text-gray-400 ${openGroups[status] ? 'rotate-180' : ''
                        }`}
                    />
                  </div>

                  {openGroups[status] && (
                    <div className="mt-2 ">
                      {statusGroups[status].map((habit: any) => {
                        const bgColor = getHabitColor(status)
                        return (
                          <div
                            key={habit.id}
                            className={`habit flex items-center p-3 rounded-md mb-2 ${bgColor} `}
                            onClick={() => {
                              if (tohabit && tohabit.id === habit.id) {
                                settoggleRightSidebar(!toggleRightSidebar);
                                settohabit({})
                              } else {
                                settoggleRightSidebar(true);
                                settohabit(habit);
                              }
                            }}
                          >
                            <div className="circle bg-gray-400 w-10 h-10 rounded-full"></div>
                            <div className={`ml-3 flex justify-between w-full border-b pb-2 ${bgColor}`}>
                              <div>
                                <h5
                                  className={`font-semibold ${status === 'completed' ? 'line-through' : ''
                                    }`}
                                >
                                  {habit.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {habit.currentValue} / {habit.unitValue} {habit.unitType}
                                </p>
                              </div>
                              <div className="flex gap-2">

                                <Menu as="div" className="relative inline-block text-left">
                                  <div>
                                    <MenuButton
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex relative border-1 border-gray-300 items-center w-full justify-center gap-x-1  px-1 py-1 text-sm font-semibold"
                                    >
                                      <EllipsisVertical width={16} />
                                    </MenuButton>
                                  </div>
                                  <MenuItems onClick={(e) => e.stopPropagation()} className="absolute z-10 mt-2 w-44 -left-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in ">
                                    <div className="py-1">

                                      <MenuItem >
                                        <a onClick={() => undoLog(habit.id, habit.logs[habit.logs.length - 1].id)} className={`flex gap-2 px-4 py-2 text-sm cursor-pointer `}>
                                          <Undo width={16} /> Undo Log
                                        </a>
                                      </MenuItem>
                                    </div>
                                  </MenuItems>
                                </Menu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null
            )}
            {statusGroups.pending.length === 0 && <div className='w-full flex h-screen justify-center items-center text-gray-400 font-bold text-xl'>Add your first habit!!!</div>}
            {statusGroups.pending.map((habit: any) => {
              return (
                <div
                  key={habit.id}
                  className={`habit flex items-center p-3 rounded-md mb-2`}
                  onClick={() => {
                    if (tohabit && tohabit.id === habit.id) {
                      settoggleRightSidebar(!toggleRightSidebar);
                      settohabit({})
                    } else {
                      settoggleRightSidebar(true);
                      settohabit(habit);
                    }
                  }}
                >
                  <div className="circle bg-gray-400 w-10 h-10 rounded-full"></div>
                  <div className="ml-3 flex justify-between w-full border-b border-gray-300 pb-2">
                    <div>
                      <h5
                        className={`font-semibold`}
                      >
                        {habit.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {habit.currentValue} / {habit.unitValue} {habit.unitType}
                      </p>
                    </div>
                    <div className="flex relative gap-2">
                      {(habit.unitType === "times" ?
                        <button disabled={disabled} onClick={(e) => { e.stopPropagation(), logHabit(habit.id) }} className='border-1 mx-2 border-gray-300 h-8 flex gap-1 p-1 w-[43px] items-center justify-center font-semibold px-2 active:bg-gray-100' >
                          <Plus width={15} />1</button> : <Link to={`/journal/timer/${habit.id}`} onClick={(e) => e.stopPropagation()} className='border-1 mx-2 border-gray-300 w-[43px] h-8 flex p-1 items-center justify-center font-semibold px-2 ' ><Timer width={19} /></Link>)
                      }

                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <MenuButton
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex relative border-1 border-gray-300 items-center w-full justify-center gap-x-1  px-1 py-1 text-sm font-semibold"
                          >
                            <EllipsisVertical width={16} />
                          </MenuButton>
                        </div>
                        <MenuItems onClick={(e) => e.stopPropagation()} className="absolute z-10 mt-2 w-44 -left-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in ">
                          <div className="py-1">

                            <MenuItem disabled={disabled}>
                              <a

                                onClick={() =>
                                  finalLogHabit(habit.id, 'completed')
                                }
                                className="flex gap-2 px-4 py-2 text-sm cursor-pointer"
                              >
                                <Check width={16} /> Check-in
                              </a>
                            </MenuItem>
                            <MenuItem disabled={disabled} >
                              <a
                                onClick={() =>
                                  finalLogHabit(habit.id, 'skipped')
                                }
                                className="flex gap-2 px-4 py-2 text-sm cursor-pointer"
                              >
                                <ArrowRight width={16} /> Skip
                              </a>
                            </MenuItem>
                            <MenuItem disabled={disabled} >
                              <a
                                onClick={() =>
                                  finalLogHabit(habit.id, 'failed')
                                }
                                className="flex gap-2 px-4 py-2 text-sm cursor-pointer"
                              >
                                <X width={16} /> Fail
                              </a>
                            </MenuItem>
                            <MenuItem >
                              <a
                                onClick={() => { setIsModalOpen(true), sethabitId(habit.id) }}
                                className="flex gap-2 px-4 py-2 text-sm cursor-pointer"
                              >
                                <Pencil width={16} /> Edit
                              </a>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                  <div className="line"></div>
                </div>
              );
            }
            )}

          </div>
        </div>
      )}
      
        <RightSidebar habit={tohabit} />
   
    </>
  )
}

export default Habits
