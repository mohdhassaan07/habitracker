import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Ban, Plus, Infinity } from 'lucide-react'
import { useState, useEffect } from 'react';
import Modal from './Modal'
import toast, { Toaster } from 'react-hot-toast';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useHabitData } from '@/store/HabitProvider';
const Header = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isInp, setisInp] = useState('times')
    const [loading, setLoading] = useState(false);
    const {habitData} = useHabitData();
    //@ts-ignore
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
            console.log(response.data);
            setModalOpen(false)
            await habitData.unshift(response.data)
            if (response.status === 200) {
                toast.success('Habit created successfully!')
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
            navigate('/journal')
        }
    }
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    }

    return (
        <div className="border-b-1 gap-3 border-gray-300 w-full h-[48.5px] flex items-center justify-end px-4">
            <input type="date" name='date' className='border border-gray-500 rounded-lg p-1' />
            <div className="flex px-1 py-1 rounded-md border-2 border-gray-300 overflow-hidden max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                    className="fill-gray-600 mr-3 rotate-90">
                    <path
                        d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                </svg>
                <input type="text" placeholder="Search Something..." className="w-full outline-none bg-transparent text-gray-600 text-sm" />
            </div>
            <Toaster position='top-right' />
            <Menu as="div" className=" relative inline-block text-left">
                <div>
                    <MenuButton className="inline-flex  items-center w-full justify-center gap-x-1 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
                        <Plus width={20} />Add Habit
                    </MenuButton>
                </div>

                <MenuItems
                    transition
                    className="absolute  z-30 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                    <div className="py-1">
                        <MenuItem  >
                            <div onClick={() => setModalOpen(true)}
                                className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                <Infinity /> Create Good Habit
                            </div>
                        </MenuItem>

                        <MenuItem>
                            <a
                                href="#"
                                className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                <Ban width={20} /> Break Bad Habit
                            </a>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}  >
                <h2 className="text-xl font-bold mb-4">New Habit</h2>
                <form onClick={() => setOpen(false)} onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h5 className="block text-sm font-medium mb-3 text-gray-500">Habit Name</h5>
                        <input type="text" name="name" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md " placeholder="Enter habit name" required />
                    </div>
                    <h5 className="block text-sm font-medium text-gray-500">GOAL</h5>
                    <div className='flex gap-4 justify-center mb-2 py-3'>
                        {isInp == 'minutes' ? <input type="number" defaultValue={1} min={1} step={5} className='h-10 w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" /> : <input type="number" defaultValue={1} min={1} step={1} className='h-10 w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" id="" />}
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
        </div>
    )
}

export default Header
