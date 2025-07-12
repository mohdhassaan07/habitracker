import Modal from "./Modal"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
const Settings = (props: any) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state: any) => state.user.currentUser);
    return (
        <div>
            <Modal isOpen={props.isModalOpen} onClose={() => props.setIsModalOpen(false)} >                
                    <h2 className="text-3xl font-semibold mb-5 w-full text-center ">Profile</h2>
                    <div className="flex justify-center items-center my-10 gap-5 h-full">
                        <img draggable="false" className="rounded-full w-24 h-24 mb-3" src="https://w0.peakpx.com/wallpaper/164/917/HD-wallpaper-black-all-amoled-battery-dark-gray-noir-plain-screen-solid.jpg" alt="" />
                        <form action="" className="flex flex-col gap-2" >
                            <input type="text" value={currentUser.name} className="border border-gray-300  rounded-md p-1 px-3 tracking-tight w-full focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter your name" />
                            <input type="email" disabled value={currentUser.email} className="border border-gray-300 text-gray-500 tracking-tight rounded-md p-1 px-3 w-full focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter your email" />
                            <input type="submit" value="Save" className="bg-blue-500 text-white rounded-md p-1 w-24 cursor-pointer hover:bg-blue-600 transition duration-200 " />
                        </form>
                    </div>
                <div className="border border-gray-200 p-2 rounded-lg" >
                    <div className="flex justify-between items-center p-2 border-b border-gray-200" >
                        <h3 className=" tracking-tight " >Reset Habit data</h3>
                        <button className="text-red-500 tracking-tighter border-red-500 rounded-md p-1 px-2" >Reset</button>
                    </div>
                    <div className="flex justify-between items-center p-2 border-b border-gray-200" >
                        <h3 className="tracking-tight " >Delete Account</h3>
                        <button className="text-red-500  border-red-500 tracking-tighter rounded-md p-1 px-2" >Delete</button>
                    </div>
                    <div className="flex justify-between items-center p-2 border-gray-200" >
                        <h3 className="tracking-tight " >Logout from Habitracker</h3>
                        <button className=" border-red-500 text-red-500 tracking-tighter rounded-md p-1 px-2" onClick={() => navigate("/logout")} >Logout</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Settings
