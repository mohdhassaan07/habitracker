import { useState, useEffect } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Header from "./Header"
import { ChevronDown, Plus, EllipsisVertical, ArrowRight, Check, X, Pencil } from "lucide-react"
import '../App.css'
import RightSidebar from "../components/RightSidebar";
import { useHabitData } from '@/store/HabitProvider'
const Habits = (props: any) => {
  const [toggleRightSidebar, settoggleRightSidebar] = useState(false)
  const { timeOfDayData, fetchTimeOfDayData, loading } = useHabitData();

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

  if (loading) {
    return <div className="w-full flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  }
  return (
    <>
      <div className=" w-full">
        <Header />
        <div className="element relative flex flex-col px-3 h-[92vh] overflow-y-auto">
          <div className=" flex z-20 justify-between  mb-6 p-2 items-center sticky top-0 bg-white">
            <h2 className="text-xl font-bold" >{props.tab}</h2>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex  items-center w-full justify-center gap-x-1 rounded-md  px-3 py-1 text-sm font-semibold text-blue-500">
                  <p className="text-blue-600"> How are you feeling today </p><ChevronDown className="mt-0.5" width={20} />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="mood absolute z-20 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      😃 Happy
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      😊 Good
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      😐 Okay
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      😟 Bad
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      😩 Terrible
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
          {/* <div className='habit my-2 flex items-center' onClick={() => settoggleRightSidebar(!toggleRightSidebar)} >
            <div className="circle bg-green-400 w-10 h-10 rounded-full"></div>
            <div className='mx-2 flex justify-between w-full border-b-1 border-gray-300' >
              <div>
                <h5 className='font-semibold tracking-tight' >Eat Fruits</h5>
                <p className='text-sm my-1 text-gray-500 tracking-tight'  >1/2 times</p>
              </div>
              <div className='flex gap-2' >
                <button className='border-1 border-gray-300 h-8 flex gap-1 p-1  items-center justify-center font-semibold px-2 ' ><Plus width={16} />1</button>
                <Menu as="div" className=" relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex relative border-1 border-gray-300 items-center w-full justify-center gap-x-1  px-1 py-1 text-sm font-semibold">
                      <EllipsisVertical width={16} />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute z-20 mt-2 w-44 -left-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="flex gap-1 items-center align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          <ArrowRight width={20} /> Skip
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          <Check width={20} /> Check-in
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          <X width={20} /> Fail
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          <Pencil width={20} /> Edit
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div> */}
          {timeOfDayData.length === 0 && <div className='w-full flex h-screen justify-center items-center text-gray-400  font-bold text-xl' ><div>Add your first habit!!!</div></div>}
          {timeOfDayData.map((habit: any) => {
            return (<div key={habit.id} className='habit my-2 flex items-center' onClick={() => settoggleRightSidebar(!toggleRightSidebar)} >
              <div className="circle bg-gray-400 w-10 h-10 rounded-full"></div>
              <div className='mx-2 flex justify-between w-full border-b-1 border-gray-300' >
                <div>
                  <h5 className='font-semibold tracking-tight' >{habit.name} </h5>
                  <p className='text-sm my-1 text-gray-500 tracking-tight'  >{habit.currentValue} / {habit.unitValue} {habit.unitType}</p>
                </div>
                <div className='flex gap-2' >
                  <button onClick={(e) => e.stopPropagation()} className='border-1 border-gray-300 h-8 flex gap-1 p-1  items-center justify-center font-semibold px-2 ' ><Plus width={16} />1</button>
                  <Menu as="div" className=" relative inline-block text-left">
                    <div>
                      <MenuButton onClick={(e) => e.stopPropagation()} className="inline-flex relative border-1 border-gray-300 items-center w-full justify-center gap-x-1  px-1 py-1 text-sm font-semibold">
                        <EllipsisVertical width={16} />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute z-20 mt-2 w-44 -left-36 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        
                        <MenuItem>
                          <a
                            href="#"
                            className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <Check width={20} /> Check-in
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="flex gap-1 items-center align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <ArrowRight width={20} /> Skip
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <X width={20} /> Fail
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="flex gap-1 align-middle px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <Pencil width={20} /> Edit
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>)
          })}

        </div>
      </div>
      {!toggleRightSidebar &&
        <div className="quote w-[573px] border-l-1 border-gray-300 h-full flex items-center justify-center" >
          <div className="quote-box flex justify-center items-center h-full w-full" >
            <h1 className='text-2xl font-semibold text-gray-500 text-center' >"The journey of a thousand miles begins with one step."</h1>
          </div>
        </div>
      }

      {toggleRightSidebar && <RightSidebar />}
    </>
  )
}

export default Habits
