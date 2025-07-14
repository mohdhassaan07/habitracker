import express from 'express';
import cors from 'cors';
import habitRouter from './routes/habit';
import userRouter from './routes/user';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
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

app.use('/api/user', userRouter)
app.use('/api/habit', habitRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
