import { Send, Bot, Sparkles } from "lucide-react";
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
    }, [chat, typing]);
    useEffect(() => {
        socket.on("typing", (state) => setTyping(state));

        socket.on("aiReply", (data) => {
            setChat((prev) => [...prev, { id: uuid(), sender: "bot", text: data }]);
        });
    }, [socket]);
    const userId = currentUser.id;

    const sendMessage = () => {
        if (!message.trim()) return;
        setChat((prev) => [...prev, { id: userId, sender: "user", text: message }]);
        socket.emit("userMessage", { userId, message });
        setMessage("");
    };

    return (
        <div className="absolute z-30 top-[12rem] lg:top-[3rem] right-[1rem] lg:left-[3rem] lg:w-[22rem] w-[18rem] lg:h-[32rem] h-[26rem] rounded-2xl overflow-hidden flex flex-col
            border border-white/30 dark:border-gray-600/40
            bg-white/80 dark:bg-gray-900/85 backdrop-blur-2xl
            shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5
            animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div className="relative px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm leading-tight">AI Assistant</h3>
                    <p className="text-white/70 text-xs">Ask about your habits</p>
                </div>
                <Sparkles className="w-4 h-4 text-white/60" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chat.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center gap-3 opacity-60">
                        <div className="w-12 h-12 mt-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[12rem]">
                            Ask me anything about your habits, progress, or goals!
                        </p>
                    </div>
                )}
                {chat.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${msg.sender === "user"
                            ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl rounded-br-md shadow-md shadow-indigo-500/20"
                            : "mr-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md shadow-sm"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
                {typing && (
                    <div className="mr-auto flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md w-fit">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-200/60 dark:border-gray-700/40 bg-white/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/80 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-400/50 transition-shadow">
                    <input
                        type="text"
                        placeholder="Ask about your habits…"
                        className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none py-1.5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        className="flex items-center justify-center w-8 h-8 rounded-lg
                            bg-gradient-to-r from-indigo-500 to-purple-500
                            text-white cursor-pointer
                            transition-all duration-200
                            hover:shadow-md hover:shadow-purple-500/30
                            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
                            active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AiAssistant
