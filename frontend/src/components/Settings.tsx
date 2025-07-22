import { useState, useRef } from "react"
import Modal from "./Modal"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "@/utils/api"
import { signinstart, signinSuccess } from "@/redux/userSlice"
import { useHabitData } from "@/store/HabitProvider"
import CircularProgress from "@mui/material/CircularProgress"
const Settings = (props: any) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const [image, setimage] = useState("")
    const dispatch = useDispatch()
    const {removeData, resetData} = useHabitData()
    const [loading, setloading] = useState(false)
    const [formData, setformData] = useState<any>({
        name: currentUser.name,
    })
    const imageRef = useRef<any>(null)

    const handleChange = (e: any) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            const reader: any = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setformData({
                    ...formData,
                    file: reader.result,
                })
                setimage(reader.result)
            }

        }
        console.log(file);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            setloading(true)
            dispatch(signinstart())
            const res = await api.put(`/user/editUser/${currentUser.id}`, formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            if (res.status === 200) {
                dispatch(signinSuccess(res.data.user))
                console.log(res)
                toast.success("Details edited successfully")
            }
        } catch (error) {
            toast.error("error editing details")
            console.error("error :", error)
        } finally {
            setloading(false)
        }
    }

    const resetHabitData = async()=>{
        try {
            const confirm = window.confirm("Are you sure you want to reset your habit data? This action cannot be undone.")
            if (!confirm) return;
            setloading(true)
            const res = await api.get(`/habit/resetHabits/${currentUser.id}`)
            if (res.status === 200) {
                resetData()
                toast.success("Habit data reset successfully")
            }
        } catch (error) {
            console.error("Error resetting habit data:", error);
            toast.error("Error resetting habit data");            
        }finally{
            setloading(false)
        }
    }

    const deleteAllData = async()=>{
        try {
            const confirm = window.confirm("Are you sure you want to delete all your data? This action cannot be undone.")
            if (!confirm) return;
            setloading(true)
            const res = await api.delete(`/habit/deleteAllData/${currentUser.id}`)
            if (res.status === 200) {
                removeData()
                toast.success("All data deleted successfully")
            }
        } catch (error) {
            console.error("Error deleting all data:", error);
            toast.error("Error deleting all data");
        } finally {
            setloading(false)
        }
    }

    const deleteAccount = async()=>{
        try {
            const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")
            if (!confirm) return;
            setloading(true)
            const res = await api.delete(`/user/deleteUser/${currentUser.id}`)
            if (res.status === 200) {
                await navigate("/logout")
                toast.success("Account deleted successfully")
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Error deleting account");
            
        }
    }
    return (
        <div>
            <Modal isOpen={props.isModalOpen} onClose={() => props.setIsModalOpen(false)} >
                {loading && 
                    <CircularProgress size={"4rem"} className="absolute left-[40%] top-[42%]" />
                
                }
                {!loading && <div>
                    <h2 className="text-3xl font-semibold mb-5 w-full text-center ">Profile</h2>
                    <div className="flex justify-center items-center my-10 gap-3 h-full">
                        <img draggable="false" onClick={() => imageRef.current.click()} onChange={handleImageChange} className="rounded-full cursor-pointer w-28 h-28 mb-3" src={image ? image : currentUser.profilePic} alt="profile" />
                        <input ref={imageRef} type="file" accept='image/*' onChange={handleImageChange} hidden />
                        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-2" >
                            <input type="text" onChange={handleChange} value={formData.name} name="name" className="border border-gray-300  rounded-md p-1 px-3 tracking-tight w-full focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter your name" />
                            <input type="email" disabled value={currentUser.email} className="border border-gray-300 text-gray-500 tracking-tight rounded-md p-1 px-3 w-full focus:outline-none focus:ring focus:ring-blue-500" placeholder="Enter your email" />
                            <input type="submit" value="Save" className="bg-blue-500 text-white rounded-md p-1 w-24 cursor-pointer hover:bg-blue-600 transition duration-200 " />
                        </form>
                    </div>
                    <div className="border border-gray-200 p-2 rounded-lg" >
                        <div className="flex justify-between items-center p-2 border-b border-gray-200" >
                            <h3 className=" tracking-tight " >Reset Habit data</h3>
                            <button onClick={()=> resetHabitData()} className="text-red-500 tracking-tighter border-red-500 rounded-md p-1 px-2" >Reset</button>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b border-gray-200" >
                            <h3 className="tracking-tight " >Delete All Data</h3>
                            <button className=" border-red-500 text-red-500 tracking-tighter rounded-md p-1 px-2" onClick={()=> deleteAllData()} >Delete</button>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b border-gray-200" >
                            <h3 className="tracking-tight " >Delete Account</h3>
                            <button onClick={()=> deleteAccount()} className="text-red-500  border-red-500 tracking-tighter rounded-md p-1 px-2" >Delete</button>
                        </div>

                    </div>
                </div>}
            </Modal>
        </div>
    )
}

export default Settings
