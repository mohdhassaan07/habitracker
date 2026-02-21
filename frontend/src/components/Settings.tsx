import { useState, useRef } from "react"
import Modal from "./Modal"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "@/utils/api"
import { signinstart, signinSuccess } from "@/redux/userSlice"
import { useHabitData } from "@/store/HabitProvider"
import CircularProgress from "@mui/material/CircularProgress"
import { Camera, RotateCcw, Trash2, UserX } from "lucide-react"
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
                    <div className="flex items-center justify-center min-h-[20rem]">
                        <CircularProgress size={"3rem"} />
                    </div>
                }
                {!loading && <div className="space-y-4  ">
                    {/* Header */}
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Profile Settings</h2>

                    {/* Avatar + Form Section */}
                    <div className="flex flex-col items-center gap-5">
                        {/* Avatar */}
                        <div className="relative group cursor-pointer" onClick={() => imageRef.current.click()}>
                            <img 
                                draggable="false" 
                                className="rounded-full w-24 h-24 object-cover ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg transition-transform group-hover:scale-105" 
                                src={image ? image : currentUser.profilePic} 
                                alt="profile" 
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <input ref={imageRef} type="file" accept='image/*' onChange={handleImageChange} hidden />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Name</label>
                                <input 
                                    type="text" 
                                    onChange={handleChange} 
                                    value={formData.name} 
                                    name="name" 
                                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl p-2.5 px-4 text-sm tracking-tight w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" 
                                    placeholder="Enter your name" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Email</label>
                                <input 
                                    type="email" 
                                    disabled 
                                    value={currentUser.email} 
                                    className="border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 rounded-xl p-2.5 px-4 text-sm tracking-tight w-full cursor-not-allowed" 
                                    placeholder="Enter your email" 
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl py-2.5 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/25"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Danger Zone</h3>
                        <div className="border border-red-200 dark:border-red-900/40 rounded-xl overflow-hidden divide-y divide-red-100 dark:divide-red-900/30">
                            <div className="flex justify-between items-center px-4 py-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <RotateCcw className="w-4 h-4 text-red-400" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reset Habit Data</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Reset all progress to zero</p>
                                    </div>
                                </div>
                                <button onClick={() => resetHabitData()} className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-300 dark:border-red-800 rounded-lg px-3 py-1.5 transition-all duration-200">Reset</button>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Delete All Data</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Remove all habits and logs</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteAllData()} className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-300 dark:border-red-800 rounded-lg px-3 py-1.5 transition-all duration-200">Delete</button>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <UserX className="w-4 h-4 text-red-400" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Delete Account</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Permanently remove your account</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteAccount()} className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-300 dark:border-red-800 rounded-lg px-3 py-1.5 transition-all duration-200">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>}
            </Modal>
        </div>
    )
}

export default Settings
