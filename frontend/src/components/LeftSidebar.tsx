import { NotepadText, Sunset, Sunrise, Plus, ChartNoAxesGantt, SettingsIcon, Bot, SunDim } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Settings from './Settings';
import { useTimeOfDay } from '@/store/TimeofDay';
const LeftSidebar = () => {
    const [isModalOpen, setisModalOpen] = useState(false)
    const { time } = useTimeOfDay();
    const [icon, seticon] = useState(<Sunrise />)
    //@ts-ignore
    const currentUser = useSelector((state: any) => state.user.currentUser);
    // useEffect(() => {
    //     const time = new Date().getHours()
    //     if (time >= 0 && time < 12) {
    //         settime('Morning')
    //         seticon(<Sunrise />)
    //     } else if (time >= 12 && time < 18) {
    //         settime('Afternoon')
    //         seticon(<SunDim />)
    //     } else {
    //         settime('Evening')
    //         seticon(<Sunset />)
    //     }
    // }, [time])
    
    useEffect(() => {
        if (time === 'Morning') {
            seticon(<Sunrise />)
        } else if (time === 'Afternoon') {
            seticon(<SunDim />)
        } else {
            seticon(<Sunset />)
        }
    }, [time])


    return (
        <>
            <Settings isModalOpen={isModalOpen} setIsModalOpen={setisModalOpen} />
            <div className=" border-r-1 border-gray-300 min-w-56 h-screen">
                <h1 className="text-blue-600 font-bold text-2xl w-full text-center p-2" >Habitracker</h1>
                <hr className="text-gray-300" />
                <div className="p-3">
                    <Menu as="div" className=" relative inline-block text-left">
                        <MenuButton className="flex w-50 gap-2 items-center mt-4 p-2 rounded-md bg-gray-200 hover:cursor-pointer">
                            <img className="rounded-full overflow-hidden w-7 h-7 " src="https://w0.peakpx.com/wallpaper/164/917/HD-wallpaper-black-all-amoled-battery-dark-gray-noir-plain-screen-solid.jpg" alt="image" />
                            <h4 className=" text-sm font-semibold tracking-tight" >{currentUser.name}</h4>
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute z-30 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                <MenuItem  >
                                    <div
                                        onClick={() => setisModalOpen(true)} className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        Profile
                                    </div>
                                </MenuItem>

                                <MenuItem>
                                    <Link
                                        to="/logout"
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        Logout
                                    </Link>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                    <div >

                    </div>
                    <Link to='/journal' > <button className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-5 rounded-md items-center font-semibold text-sm py-2" > <NotepadText /> All Habits</button></Link>
                    <Link to={`/journal?tab=${time}`} > <div className="text-gray-500 focus:bg-blue-600 focus:text-white hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> {icon} {time} </div></Link>

                    <div className="areas">
                        <p className='text-gray-500 w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Areas</p>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <NotepadText /> Study</div>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <Plus /> New Area</div>
                    </div>

                    <div className="preferences mt-3">
                        <p className='text-gray-500  w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Preferences</p>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <ChartNoAxesGantt /> Manage Habits</div>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <SettingsIcon /> App Settings</div>
                    </div>
                    <button className=" bg-blue-500 text-white focus:bg-blue-600 hover:shadow-lg w-full flex gap-2 p-1 mt-22 rounded-md items-center justify-center font-semibold text-sm py-2"> <Bot /> Your AI Assistant</button>
                </div>
            </div>
        </>
    )
}

export default LeftSidebar
