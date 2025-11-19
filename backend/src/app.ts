import express from 'express';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import habitRouter from './routes/habit';
import userRouter from './routes/user';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import { resetallHabits } from './utils/resetHabits';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.emit("message", { message: "Hello from server" })
    socket.on("userMessage", async (arg1: any, arg2?: any) => {
        const userId: string | undefined = typeof arg1 === "object" ? arg1?.userId : arg1;
        const message: string | undefined = typeof arg1 === "object" ? arg1?.message : arg2;
        console.log("Message received", message)
        if (!userId) {
            socket.emit("aiReply", "Missing userId.");
            return;
        }
        if (!message) {
            socket.emit("aiReply", "Please include a message.");
            return;
        }
        try {
            // fetch habits from prisma
            const habits = await prisma.habit.findMany({
                where: { userId },
                include: { logs: true }
            });

            const summary = habits.map((habit) => {
                const completedThisWeek = habit.logs.filter((log) =>
                    new Date(log.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
                    log.status === 'completed'
                ).length;
                return `${habit.name}: completed ${completedThisWeek} days this week, current streak: ${habit.streak} days.`;
            }).join("\n")

            const prompt = ` You are a helpful AI assistant in a Habit Tracking app.
Your goal is to give friendly insights, motivation, and answers based on the user's
habit data. User Data: ${summary} User Question:"${message}"
Respond in a positive and human-like tone in only 20 to 30 words.`

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const aiReply = result.response.text();
            // send message back to frontend
            socket.emit("aiReply", aiReply);
            

        } catch (err) {
            console.error(err);
            socket.emit("aiReply", "Sorry, something went wrong.");
        }
    })
})
server.listen(5000, () => {
    console.log("Socket server is running on port 5000");
})

app.use(cors(
    {
        origin: ['https://habitron-seven.vercel.app', 'http://localhost:5173', 'https://cron-job.org'],
        credentials: true
    }
));
app.use(cookieparser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/api/reset', resetallHabits);
app.use('/api/user', userRouter)
app.use('/api/habit', habitRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
