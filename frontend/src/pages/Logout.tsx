import { useDispatch } from "react-redux"
import { signout } from "../redux/userSlice"
import { useState, useEffect } from "react"
import api from "../utils/api"
import {  useNavigate } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"
import { useHabitData } from "@/store/HabitProvider"
const Logout = () => {
    const [loading, setloading] = useState(false)
    const { onLogout } = useHabitData()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const handleLogout = async () => {
            try {
                setloading(true)
                const res = await api.get("/user/signout")
                setloading(false)
                if (res.status === 200) {
                    dispatch(signout())
                    onLogout()
                    navigate("/")
                }
                
            } catch (error: any) {
                setloading(false)
                console.error("Error logging out:", error.response.data);
            }

        }
        handleLogout()
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
           <CircularProgress size={"4rem"} />
        </div>
    }
    

}

export default Logout
