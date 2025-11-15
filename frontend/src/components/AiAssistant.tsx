import { useEffect } from "react"
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const AiAssistant = () => {
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const userId = currentUser.id;
    const socket = io("http://localhost:5000", {
        transports: ["websocket"]
    })
    useEffect(() => {
        socket.emit("userMessage", { userId , "message": "Hello AI, how am I doing with my habits?"});
        socket.on("botReply", (data)=>{
            console.log("botReply:", data);
        })
    }, [])

    return (
        <div>
            hehehehhe
        </div>
    )
}

export default AiAssistant
