import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { SmilePlus, Plus, Infinity, Menu as MenuIcon } from 'lucide-react'
import { useState, useEffect } from 'react';
import Modal from './Modal'
import toast, { Toaster } from 'react-hot-toast';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useHabitData } from '@/store/HabitProvider';
import Mood from './Mood';
import CircularProgress from '@mui/material/CircularProgress';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isInp, setisInp] = useState('times')
    const [loading, setLoading] = useState(false);
    const [isMoodModalOpen, setisMoodModalOpen] = useState(false)
    const [todayMood, settodayMood] = useState("")
    const { addNewHabit, setsearchHabits, query, setquery } = useHabitData();

    const navigate = useNavigate();
    const [selectedTimes, setSelectedTimes] = useState({
        Morning: true,
        Afternoon: true,
        Evening: true,
    });
    const [formData, setFormData] = useState({
        name: '',
        unitValue: 1,
        unitType: 'times',
        frequency: 'daily',
        timeOfDay: [],
    })

    useEffect(() => {
        const selected = Object.keys(selectedTimes).filter((time) => selectedTimes[time as keyof typeof selectedTimes]);
        setFormData((prev: any) => ({
            ...prev,
            timeOfDay: selected.length > 0 ? selected : ['Morning', 'Afternoon', 'Evening'],
        }));
    }, [selectedTimes])

    const toggleDropdown = () => setOpen(!open);

    const handleCheckboxChange = (time: any) => {
        setSelectedTimes((prev: any) => ({
            ...prev,
            [time]: !prev[time],
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'unitValue' ? parseInt(value) : value,
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await api.post('/habit/createHabit', formData)
            setModalOpen(false)
            if (response.status === 200) {
                toast.success('Habit created successfully!')
                addNewHabit(response.data)
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
            navigate('/journal')
        }
    }

    const handleSearch = (e: any) => {
        setquery(e.target.value)
    }
    useEffect(() => {
        const delayFn = setTimeout(async () => {
            if (query) {
                try {
                    const res = await api.get(`/habit/search?query=${query}`)
                    if (res.status === 200) {
                        setsearchHabits(res.data.habits);
                        // const newdata = habitData.splice(0, habitData.length, ...res.data.habits);
                        toast.success(`Found ${res.data.habits.length} habits for "${query}"`);
                    }
                } catch (error) {
                    console.error("Error searching habits:", error);
                    toast.error('No habits found');
                }
            }
        }, 500);
        return () => clearTimeout(delayFn);
    }, [query])

    if (loading) {
        return (

            <CircularProgress size={"4rem"} className="absolute left-[40%] top-[45%]" />

        )
    }

    return (
        <div>
            <Mood mood={todayMood} isModalOpen={isMoodModalOpen} setisModalOpen={setisMoodModalOpen} />
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}  >
                    <h2 className="text-xl text-black font-bold mb-4">New Habit</h2>
                    <form className='text-black' onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <h5 className="block text-sm font-medium mb-3 text-gray-500">Habit Name</h5>
                            <input type="text" name="name" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md " placeholder="Enter habit name" required />
                        </div>
                        <h5 className="block text-sm font-medium text-gray-500">GOAL</h5>
                        <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 justify-center mb-2 py-3'>
                            {isInp == 'minutes' ? <input type="number" defaultValue={1} min={1} className='h-10 w-full lg:w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" /> : <input type="number" defaultValue={1} min={1} step={1} className='h-10 w-full lg:w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" id="" />}
                            <select onChange={(e) => { setisInp(e.target.value), handleChange(e) }} name="unitType" id="" className='border h-10  border-gray-300 rounded-sm p-2 '>
                                <option value="times">Times</option>
                                <option value="minutes">Mins</option>
                            </select>
                            <select name="frequency" id="" onChange={handleChange} className='border h-10  border-gray-300 rounded-sm p-2 '>
                                <option value="daily">Per Day</option>
                                <option value="weekly">Per Week</option>
                                <option value="monthly">Per Month</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <h5 className='text-sm font-medium mb-3 text-gray-500' >Time of Day</h5>
                            <div className="w-full relative" onClick={(e) => e.stopPropagation()}>
                                {/* Dropdown Button */}
                                <div
                                    onClick={toggleDropdown}
                                    className="border  border-gray-300 w-full px-4 py-2 rounded cursor-pointer bg-white flex justify-between items-center"
                                >
                                    <span className="text-gray-700">
                                        {selectedTimes['Morning'] && selectedTimes['Afternoon'] && selectedTimes['Evening'] ? 'Any Time' : ''}
                                        {selectedTimes['Morning'] && !selectedTimes['Afternoon'] && !selectedTimes['Evening'] ? 'Morning' : ''}
                                        {selectedTimes['Afternoon'] && !selectedTimes['Morning'] && !selectedTimes['Evening'] ? 'Afternoon' : ''}
                                        {selectedTimes['Evening'] && !selectedTimes['Morning'] && !selectedTimes['Afternoon'] ? 'Evening' : ''}
                                        {selectedTimes['Morning'] && selectedTimes['Afternoon'] && !selectedTimes['Evening'] ? 'Morning, Afternoon' : ''}
                                        {selectedTimes['Morning'] && !selectedTimes['Afternoon'] && selectedTimes['Evening'] ? 'Morning, Evening' : ''}
                                        {selectedTimes['Afternoon'] && selectedTimes['Evening'] && !selectedTimes['Morning'] ? 'Afternoon, Evening' : ''}
                                        {!selectedTimes['Morning'] && !selectedTimes['Afternoon'] && !selectedTimes['Evening'] ? 'Select Time' : ''}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>

                                {/* Dropdown Content */}
                                {open && (
                                    <div className="absolute mt-2 w-full border border-gray-300 rounded bg-white shadow-md z-10">
                                        {Object.keys(selectedTimes).map((time) => (
                                            <label
                                                key={time}
                                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTimes[time as keyof typeof selectedTimes]}
                                                    onChange={() => handleCheckboxChange(time as keyof typeof selectedTimes)}
                                                    className="form-checkbox text-indigo-600 rounded mr-3"
                                                />
                                                <span className="text-gray-700">{time}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Create Habit</button>
                    </form>
                </Modal>
            <div className="border-b-1 gap-2 lg:gap-3 border-gray-300 w-full h-[48.5px] flex items-center justify-between lg:justify-end px-2 lg:px-4">
                <button
                    onClick={() => toggleSidebar?.()}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <MenuIcon className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center gap-2 lg:gap-3">
                    <Menu as="div" className="relative inline-block text-left mt-2">
                        <div>
                            <MenuButton className="inline-flex text-gray-500 focus:outline-none items-center w-full justify-center rounded-md text-sm">
                                <div className="relative flex items-center justify-center">
                                    <span className="group relative flex items-center">
                                        <SmilePlus />
                                        <span
                                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-8 z-50 mb-2 px-2 py-1 text-white bg-blue-500 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                                        >
                                            Log your mood
                                        </span>
                                    </span>
                                </div>
                            </MenuButton>
                        </div>

                        <MenuItems
                            transition
                            className="mood absolute z-20 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        onClick={() => { setisMoodModalOpen(true), settodayMood("happy") }}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😃 Happy
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={() => { setisMoodModalOpen(true), settodayMood("good") }}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😊 Good
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={() => { setisMoodModalOpen(true), settodayMood("okay") }}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😐 Okay
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={() => { setisMoodModalOpen(true), settodayMood("bad") }}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😟 Bad
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={() => { setisMoodModalOpen(true), settodayMood("terrible") }}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😩 Terrible
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                    <div className="flex px-1 py-1 rounded-md border-2 border-gray-300 overflow-hidden max-w-32 lg:max-w-md">
                        <input type="text" onChange={handleSearch} placeholder="Search..." className="w-full outline-none bg-transparent text-gray-600 text-xs lg:text-sm" />
                    </div>
                    <Toaster position='top-right' />
                    <Menu as="div" className=" relative inline-block text-left">
                        <div>
                            <MenuButton className="inline-flex items-center w-full justify-center gap-x-1 rounded-md bg-blue-500 px-2 lg:px-3 py-1 text-xs lg:text-sm font-semibold text-white">
                                <Plus width={16} className="lg:w-5" />Add Habit
                            </MenuButton>
                        </div>

                        <MenuItems
                            
                            className="absolute -left-[7rem] lg:left-0 mt-2 z-10 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1 z-10">
                                <MenuItem  >
                                    <div onClick={() => setModalOpen(true)}
                                        className="flex cursor-default gap-1 z-10 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        <Infinity /> Create Good Habit
                                    </div>
                                </MenuItem>

                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Header
