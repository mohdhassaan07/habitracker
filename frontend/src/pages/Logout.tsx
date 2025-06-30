import { useDispatch } from "react-redux"
import { signout } from "../redux/userSlice"
import { useState, useEffect } from "react"
import api from "../utils/api"
import {  useNavigate } from "react-router-dom"

const Logout = () => {
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const handleLogout = async () => {
            try {
                setloading(true)
                const res = await api.get("/user/signout")
                console.log(res);
                setloading(false)
                dispatch(signout())
                navigate("/")
            } catch (error: any) {
                setloading(false)
                console.error("Error logging out:", error.response.data);
            }

        }
        handleLogout()

    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
    }
    

}

export default Logout
