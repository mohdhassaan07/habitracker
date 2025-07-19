import { NotepadText, Sunset, Sunrise, ChevronDown, SmilePlus, ChartNoAxesGantt, SettingsIcon, Bot, SunDim } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Settings from './Settings';
import { useTimeOfDay } from '@/store/TimeofDay';
import Mood from './Mood';
const LeftSidebar = () => {
    const [isModalOpen, setisModalOpen] = useState(false)
    const [isMoodModalOpen, setisMoodModalOpen] = useState(false)
    const [todayMood, settodayMood] = useState("")
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
            <Mood mood={todayMood} isModalOpen={isMoodModalOpen} setisModalOpen={setisMoodModalOpen} />
            <Settings isModalOpen={isModalOpen} setIsModalOpen={setisModalOpen} />
            <div className=" border-gray-300 bg-white rounded-2xl min-w-56 m-2 max-h-screen">
                <h1 className="text-blue-600 font-bold text-2xl w-full text-center p-2" >Habitracker</h1>
                <hr className="text-gray-300" />
                <div className="p-3">
                    <Menu as="div" className=" relative inline-block text-left">
                        <MenuButton className="flex w-50 gap-2 items-center mt-4 p-2 rounded-md border border-gray-300 hover:cursor-pointer">
                            <img className="rounded-full overflow-hidden w-7 h-7 " src={currentUser.profilePic} alt="image" />
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

                    {/* <div className="areas">
                        <p className='text-gray-500 w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Areas</p>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <NotepadText /> Study</div>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <Plus /> New Area</div>
                    </div> */}
                    <div className="mood">
                        <p className='text-gray-500 w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Mood</p>
                        <Menu as="div" className="relative inline-block text-left mt-2">
                        <div>
                            <MenuButton className="inline-flex text-gray-500 items-center w-full justify-center gap-x-1 rounded-md py-1 text-sm font-semibold">
                                <SmilePlus /><p className=" mx-1"> Log your mood </p><ChevronDown className="mt-0.5" width={20} />
                            </MenuButton>
                        </div>

                        <MenuItems
                            transition
                            className="mood absolute z-20 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        onClick={()=>{setisMoodModalOpen(true), settodayMood("happy")}}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😃 Happy
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={()=>{setisMoodModalOpen(true), settodayMood("good")}}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😊 Good
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={()=>{setisMoodModalOpen(true), settodayMood("okay")}}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😐 Okay
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={()=>{setisMoodModalOpen(true), settodayMood("bad")}}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😟 Bad
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={()=>{setisMoodModalOpen(true), settodayMood("terrible")}}
                                        className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        😩 Terrible
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                    </div>
                    

                    <div className="preferences mt-3">
                        <p className='text-gray-500  w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2' >Preferences</p>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <ChartNoAxesGantt /> Manage Habits</div>
                        <div className="text-gray-500  hover:bg-gray-100 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <SettingsIcon /> App Settings</div>
                    </div>
                    <button className=" bg-blue-500 text-white focus:bg-blue-600 hover:shadow-lg w-full flex gap-2 p-1 mt-30 rounded-md items-center justify-center font-semibold text-sm py-2"> <Bot /> Your AI Assistant</button>
                </div>
            </div>
        </>
    )
}

export default LeftSidebar
