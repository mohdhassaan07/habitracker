import { NotepadText, Sunset, Sunrise, ChartNoAxesGantt, SettingsIcon, Bot, SunDim, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Settings from './Settings';
import { useTimeOfDay } from '@/store/TimeofDay';
import AiAssistant from './AiAssistant';
const LeftSidebar = () => {
    const [isModalOpen, setisModalOpen] = useState(false)
    const [isAiOpen, setisAiOpen] = useState(false)
    const { time } = useTimeOfDay();
    const [icon, seticon] = useState(<Sunrise />)
    //@ts-ignore
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get('tab');
    const isAllHabits = location.pathname === '/journal' && !tab;
    const isTimeTab = tab === time;
    const isManageHabits = tab === 'manageHabits';

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
            {isAiOpen && <AiAssistant />}
            <Settings isModalOpen={isModalOpen} setIsModalOpen={setisModalOpen} />
            <div className="flex flex-col border border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl z-10 rounded-2xl absolute lg:relative top-11 lg:top-0 left-1 lg:left-0 min-w-56 w-56 m-2 lg:min-h-[97.5vh] min-h-[70vh] lg:max-h-screen">
                <h1 className="block bg-linear-to-r 
                     from-blue-800 via-indigo-500 to-blue-400 text-transparent bg-clip-text  font-bold text-xl lg:text-2xl w-full text-center p-2" >Habitron</h1>
                <hr className="hidden lg:block text-gray-300" />
                <div className="p-3 relative flex-1">
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
                    <Link to='/journal' > <button className={`w-full flex gap-2 p-1 mt-5 rounded-md items-center font-semibold text-sm py-2 ${isAllHabits ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/30'}`} > <NotepadText /> All Habits</button></Link>
                    <Link to={`/journal?tab=${time}`} > <div className={`cursor-default w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2 ${isTimeTab ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/30'}`}> {icon} {time} </div></Link>


                    <div className="preferences mt-3">
                        <p className='text-gray-500 w-full flex gap-2 mt-2 rounded-md items-center font-semibold text-sm py-2'>Preferences</p>
                        <Link to='/journal?tab=manageHabits' className={`w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2 cursor-default ${isManageHabits ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/30'}`}> <ChartNoAxesGantt /> Manage Habits</Link>
                        <div onClick={() => setisModalOpen(true)} className="text-gray-500 cursor-default hover:bg-gray-100 dark:hover:bg-gray-700/30 w-full flex gap-2 p-1 mt-2 rounded-md items-center font-semibold text-sm py-2"> <SettingsIcon /> Settings</div>
                    </div>
                </div>
                <div className="p-3 pt-0">
                    <button
                        onClick={() => setisAiOpen(!isAiOpen)}
                        className="group relative w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        text-white cursor-pointer
                        transition-all duration-300 ease-in-out
                        hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5
                        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                        overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
                            <Bot className="w-4 h-4" />
                        </span>
                        <span className="relative flex-1 text-left">AI Assistant</span>
                        <Sparkles className="relative w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default LeftSidebar
