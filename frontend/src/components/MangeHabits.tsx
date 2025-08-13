import { useState } from 'react';
import { MenuIcon, NotepadText, Pencil, SunDim, Sunrise, Sunset, Trash2 } from 'lucide-react';
import EditHabit from './EditHabit';
import { useHabitData } from '../store/HabitProvider';
import '../App.css';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import RightSidebar from './RightSidebar';

const TABS = [
  { label: 'All Habits', value: 'all', icon: <NotepadText /> },
  { label: 'Morning', value: 'Morning', icon: <Sunrise /> },
  { label: 'Afternoon', value: 'Afternoon', icon: <SunDim /> },
  { label: 'Evening', value: 'Evening', icon: <Sunset /> },
];

const ManageHabits = ({ toggleSidebar }: any) => {
  const { habitData, updateHabits } = useHabitData();
  const [selectedTab, setSelectedTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitId, setHabitId] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  const [toHabit, settoHabit] = useState<any>({})
  const [openRightSidebar, setopenRightSidebar] = useState(false)

  const filterHabits = () => {
    if (selectedTab === 'all') return habitData;
    return habitData.filter((habit: any) =>
      habit.timeOfDay && habit.timeOfDay.some((time: any) =>
        typeof time === 'string' ? time === selectedTab : time.label === selectedTab
      )
    );
  };

  const handleEdit = (habitId: string) => {
    setHabitId(habitId);
    setIsModalOpen(true);
  };

  const handleDelete = async (habitId: string) => {
    const c = confirm("Are you sure you want to delete this habit?")
    try {
      if (c === true) {
        setloading(true)
        const response = await api.delete(`/habit/deleteHabit/${habitId}`)
        if (response.status === 200) {
          toast.success('Habit Deleted Successfully!')
          updateHabits(habitId)
        }
      }

    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error('Failed to delete habit. Please try again.')
    } finally {
      setloading(false)
    }
  }

  if (loading) {
    return <div className="w-[55%] bg-white m-2 rounded-2xl max-h-screen flex justify-center items-center">
      <CircularProgress size={"4rem"} />
    </div>
  }

  if (!habitData || habitData.length === 0) {
    return <div className="w-full lg:w-[55%] z-20 bg-white m-2 rounded-2xl h-screen flex justify-center items-center">
      <CircularProgress size={"4rem"} />
    </div>
  }

  return (
    <>
      <div className="relative w-full bg-white lg:m-2 lg:rounded-2xl max-h-screen flex">
        {/* Right Sidebar for screens less than lg - positioned on top */}
        {openRightSidebar && (
          <div className="lg:hidden absolute top-0 left-0 w-full h-full z-10">
            <RightSidebar
              habit={toHabit}
              onClose={() => {
                setopenRightSidebar(false);
                settoHabit({});
              }}
            />
          </div>
        )}

        <div className="lg:w-64 p-2 lg:p-4 flex flex-col border-r border-gray-200">
          <button
            onClick={() => toggleSidebar?.()}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <MenuIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="lg:text-xl font-bold mb-8">Manage Habits</h2>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`text-left flex justify-center lg:justify-normal lg:px-4 py-2 rounded-md mb-1 font-semibold ${selectedTab === tab.value ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.icon && <span className="lg:mr-2">{tab.icon}</span>}
              <span className='hidden lg:flex'>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="element lg:p-4 p-1 overflow-y-auto w-full">
          <div className="flex mt-2 justify-between">
            <h2 className="text-xl text-gray-600 font-bold mb-4">{TABS.find(t => t.value === selectedTab)?.label}</h2>
          </div>

          {filterHabits().length === 0 ? (
            <div className='w-full flex h-screen justify-center items-center text-gray-400 font-bold text-xl'>
              No habits found for this time period.
            </div>
          ) : (
            <div>
              {filterHabits().map((habit: any) => (
                <div
                  key={habit.id}
                  className="habit flex items-center lg:p-3 rounded-md mb-2"
                  onClick={() => { setopenRightSidebar(!openRightSidebar); settoHabit(habit) }}
                >
                  <div className={`circle bg-gray-100 text-gray-400 flex items-center justify-center font-bold w-10 h-10 rounded-full`}>
                    {habit.name.split(" ").map((word: string) => word.charAt(0).toUpperCase()).join("").slice(0, 2)}
                  </div>
                  <div className="ml-3 flex border-b border-gray-300 pb-2 justify-between w-full">
                    <div>
                      <h5 className="font-semibold gap-2 flex">
                        {habit.name}
                        <button className='text-sm bg-gray-100 p-1 rounded-4xl font-normal text-gray-600' >{habit.frequency}</button>
                      </h5>
                      <p className="text-sm text-gray-600">
                        {habit.currentValue} / {habit.unitValue} <span className='text-gray-400 ml-4' >created on {new Date(habit.createdAt).toLocaleDateString()} | last updated on {new Date(habit.updatedAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(habit.id) }}
                        className="border-1 border-gray-300 h-8 items-center w-full justify-center px-2 text-sm font-semibold relative group"
                      >
                        <Pencil width={16} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          Edit
                        </span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(habit.id) }}
                        className="border-1 border-gray-300 h-8 items-center w-full justify-center px-2 text-sm font-semibold relative group"
                      >
                        <Trash2 width={16} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      {habitId && (
        <EditHabit isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} habitId={habitId} />
      )}
      {/* Right Sidebar for lg screens and above */}
      {openRightSidebar && <RightSidebar habit={toHabit} />}


    </>
  );
};

export default ManageHabits; 