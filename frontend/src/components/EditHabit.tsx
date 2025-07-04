import Modal from "./Modal"
import { useState, useEffect } from "react"
import { useHabitData } from "@/store/HabitProvider"
import api from "@/utils/api"
import { toast } from 'react-hot-toast'

const EditHabit = (props: any) => {
    const { habitData, updateHabitValue, updateHabits } = useHabitData()
    const [formData, setFormData] = useState({
        name: '',
        unitValue: 1,
        unitType: 'times',
        frequency: 'daily',
        timeOfDay: [],
    })
    const [loading, setloading] = useState(false)
    const [open, setOpen] = useState(false);
    const [isInp, setisInp] = useState('times')
    const [selectedTimes, setSelectedTimes] = useState({
        Morning: true,
        Afternoon: true,
        Evening: true,
    });

    useEffect(() => {
        for (let i = 0; i < habitData.length; i++) {
            if (habitData[i].id === props.habitId) {
                setFormData({
                    name: habitData[i].name,
                    unitValue: habitData[i].unitValue,
                    unitType: habitData[i].unitType,
                    frequency: habitData[i].frequency,
                    timeOfDay: habitData[i].timeOfDay
                })
                break;
            }
        }
    }, [props.habitId])

    useEffect(() => {
        if (formData.timeOfDay.length > 0) {
            const initialSelectedTimes: { Morning: boolean, Afternoon: boolean, Evening: boolean } = {
                Morning: false,
                Afternoon: false,
                Evening: false,
            };

            formData.timeOfDay.forEach((time: any) => {
                const label = typeof time === "string" ? time : time.label;
                if (label === "Morning" || label === "Afternoon" || label === "Evening") {
                    initialSelectedTimes[label as keyof typeof initialSelectedTimes] = true;
                }
            });

            // Only update if there's a difference to avoid infinite loop
            const isDifferent = Object.keys(initialSelectedTimes).some(
                (key) => initialSelectedTimes[key as keyof typeof initialSelectedTimes] !== selectedTimes[key as keyof typeof selectedTimes]
            );

            if (isDifferent) {
                setSelectedTimes(initialSelectedTimes);
            }
        }
    }, [formData.timeOfDay]);

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
        e.preventDefault();
        try {
            setloading(true)
            const response = await api.put(`/habit/editHabit/${props.habitId}`, formData)
            console.log(response.data)
            if (response.status === 200) {
                updateHabitValue(props.habitId, formData.unitValue)
                toast.success('Habit Edited Successfully!')
            }
        } catch (error) {
            console.error("Error editing habit:", error);
            toast.error('Failed to edit habit. Please try again.')
        } finally {
            setloading(false)
            props.setIsModalOpen(false)
            setFormData({
                name: '',
                unitValue: 1,
                unitType: 'times',
                frequency: 'daily',
                timeOfDay: [],
            })
        }
    }

    const deleteHabit = async () => {
        const c = confirm("Are you sure you want to delete this habit?")
        try {
            if (c === true) {
                setloading(true)
                const response = await api.delete(`/habit/deleteHabit/${props.habitId}`)
                if (response.status === 200) {
                    toast.success('Habit Deleted Successfully!')
                    updateHabits(props.habitId)
                    props.setIsModalOpen(false)
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
    return <div className="w-full flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-3 border-blue-500"></div>
    </div>
  }

    return (
        <div>
            <Modal isOpen={props.isModalOpen} onClose={() => props.setIsModalOpen(false)}  >
                <h2 className="text-xl font-bold mb-4">Edit Habit</h2>
                <form onSubmit={handleSubmit} onClick={() => setOpen(false)}>
                    <div className="mb-4">
                        <h5 className="block text-sm font-medium mb-3 text-gray-500">Habit Name</h5>
                        <input type="text" name="name" onChange={handleChange} value={formData.name} className="w-full border border-gray-300 p-2 rounded-md " placeholder="Enter habit name" required />
                    </div>
                    <h5 className="block text-sm font-medium text-gray-500">GOAL</h5>
                    <div className='flex gap-4 justify-center mb-2 py-3'>
                        {isInp == 'minutes' ? <input type="number" defaultValue={formData.unitValue} min={1} step={5} className='h-10 w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" /> : <input type="number" defaultValue={formData.unitValue} min={1} step={1} className='h-10 w-16 border border-gray-300 p-1 rounded-md ' onChange={handleChange} name="unitValue" id="" />}
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
                    <button type="submit" className=" bg-blue-500 w-24 p-2 mx-2 text-white px-5 rounded-md hover:bg-blue-600">Save</button>
                    <a onClick={deleteHabit} className=" bg-red-500 cursor-default text-white w-24 p-2 rounded-md hover:bg-red-600">Delete</a>
                </form>
            </Modal>
        </div>
    )
}

export default EditHabit
