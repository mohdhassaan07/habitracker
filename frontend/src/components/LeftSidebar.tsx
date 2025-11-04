import { NotepadText, Sunset, Sunrise, ChartNoAxesGantt, SettingsIcon, Bot, SunDim } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Settings from './Settings';
import { useTimeOfDay } from '@/store/TimeofDay';
const LeftSidebar = () => {
    const [isModalOpen, setisModalOpen] = useState(false)
    const { time } = useTimeOfDay();
    const [icon, seticon] = useState(<Sunrise />)
    //@ts-ignore
    const currentUser = useSelector((state: any) => state.user.currentUser);

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
            <div className="border-gray-300 border dark:bg-gray-900 lg:border-0 lg:bg-white backdrop-blur-sm z-10 rounded-2xl absolute lg:relative top-14 lg:top-0 left-1 lg:left-0  min-w-56 w-56 m-2 lg:min-h-[97.5vh] lg:max-h-screen">
                <h1 className="block text-blue-600 font-bold text-xl lg:text-2xl w-full text-center p-2" >Habitron</h1>
                <hr className="hidden lg:block text-gray-300" />
                <div className="p-3 relative">
                    <Menu as="div" className=" relative w-full inline-block text-left">
                        <MenuButton className="flex w-full gap-2 items-center mt-4 p-2 rounded-md border border-gray-300 hover:cursor-pointer">
                            <img className="rounded-full overflow-hidden w-7 h-7 " src={currentUser.profilePic} alt="image" />
                            <h4 className=" text-sm font-semibold tracking-tight dark:text-white" >{currentUser.name}</h4>
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute z-30 w-full lg:w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
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


                    <div className="preferences mt-3">
                        <p className='text-gray-500 w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Preferences</p>
                        <a href='/journal?tab=manageHabits' className="text-gray-500 hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <ChartNoAxesGantt /> Manage Habits</a>
                        <div className="text-gray-500 hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <SettingsIcon /> App Settings</div>
                    </div>
                    <button className="lg:absolute mt-2 lg:top-[33rem] inline-flex items-center justify-center px-3 lg:px-5 py-2 text-sm lg:text-base font-semibold text-white bg-gradient-to-br
                     from-blue-400 via-indigo-500 to-blue-600 rounded-xl border-0 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
                      hover:shadow-xl hover:shadow-blue-500/60 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg shadow-blue-500/40"> <Bot /> Your AI Assistant</button>
                </div>
            </div>
        </>
    )
}

export default LeftSidebar
