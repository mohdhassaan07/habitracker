import { ArrowBigUp, Bot } from "lucide-react";
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
const AiAssistant = () => {
    interface Message {
        id: string;
        sender: "user" | "bot";
        text: string;
    }
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const [message, setMessage] = useState("");
    const [typing, setTyping] = useState(false)
    const [chat, setChat] = useState([] as Message[]);
    const baseURL = process.env.NODE_ENV === "production"
    ? "https://habitron-api.onrender.com"
    : "http://localhost:3000"
    const socket = io(baseURL, {
        transports: ["websocket"]
    })
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [socket]);
    useEffect(() => {
        socket.on("typing", (state) => setTyping(state));

        socket.on("aiReply", (data) => {
            setChat((prev) => [...prev, { id: uuid(), sender: "bot", text: data }]);
        });
    },[socket]);
    const userId = currentUser.id;

    const sendMessage = () => {
        if (!message.trim()) return;

        // Add message to UI instantly
        setChat((prev) => [...prev, { id: userId, sender: "user", text: message }]);

        socket.emit("userMessage", { userId, message });

        setMessage("");
    };


    return (
        <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-700/70 dark:text-white absolute z-30 top-[9.5rem] right-[1rem] lg:left-[3rem] lg:w-[20rem] w-[16rem] lg:h-[30rem] h-[25rem] rounded-2xl shadow-md flex flex-col">
            <div className="p-4 flex justify-center items-center gap-1 text-indigo-600 text-xl font-semibold">
                <Bot /> Habit Assistant
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.map((msg) => (
                    <div

                        className={`max-w-[70%] p-2 rounded-xl text-white ${msg.sender === "user"
                            ? "bg-indigo-500 ml-auto rounded-br-none"
                            : "bg-gray-800 mr-auto rounded-bl-none"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            {typing && (
                <div className="mr-auto text-gray-600 italic">AI is typing…</div>
            )}
            </div>

            {/* Input Box */}
            <div className="p-4 flex gap-2 shadow-lg">
                <input
                    type="text"
                    placeholder="Ask anything about your habits…"
                    className="flex-1 w-24 lg:w-full  border border-gray-400 rounded-xl px-4 py-2 outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter"}
                />

                <button
                    onClick={sendMessage}
                    className="p-2 bg-indigo-600 text-white rounded-full"
                >
                    <ArrowBigUp />
                </button>
            </div>
        </div>
    )
}

export default AiAssistant
