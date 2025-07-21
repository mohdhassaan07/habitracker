import { useState } from "react"
import Modal from "./Modal"
import api from "@/utils/api"
import { useSelector } from 'react-redux'
import toast from "react-hot-toast"
import CircularProgress from "@mui/material/CircularProgress"
const Mood = ({ mood, isModalOpen, setisModalOpen }: any) => {
    const emoji: any = {
        happy: "😃",
        good: "😊",
        okay: "😐",
        sad: "😟",
        terrible: "😩"
    }
    const currentUser = useSelector((state: any) => state.user.currentUser)
    const [formData, setformData] = useState({
        description: ""
    })
    const [loading, setloading] = useState(false)
    const handleChange = (e: any) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            setloading(true)
            const res = await api.post(`/user/logMood/${currentUser.id}`,
                {
                    mood: mood,
                    description: formData.description
                })
            toast.success("Today's mood logged")
            setformData({
                description : ""
            })
            console.log(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Error Logging today's mood")
        } finally {
            setloading(false)
        }
    }
    if (loading) {
        return( 
        <>
            <CircularProgress size={"4rem"} className="absolute left-[40%] top-[45%]" />
            {/* <div className="animate-spin absolute left-[40%] top-[45%] rounded-full h-32 w-32 border-b-3 border-blue-500"></div> */}
        </>)
    }
    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={() => setisModalOpen(false)} >
                <h1 className="font-semibold text-gray-600 text-2xl" >{emoji[mood]} {mood} ?</h1>
                <textarea onChange={handleChange} value={formData.description} className="bg-gray-100 p-2 text-gray-600 mt-5 rounded-lg" name="description" id="" placeholder="Describe your mood in some words." cols={50} rows={8}></textarea>
                <button disabled={loading} onClick={handleSubmit} className=" bg-blue-500 text-white focus:bg-blue-600 hover:shadow-lg mt-2 w-28 rounded-lg flex gap-2 p-1rounded-md items-center justify-center font-semibold text-sm py-2">Submit</button>
            </Modal>
        </div>
    )
}

export default Mood
