import express from 'express';
import { createHabit, deleteAllData, deleteHabit, editHabit, getHabits, getLoggedData, logHabit, resetHabits, searchData, undoLog } from '../controllers/habitController';
import isLoggedIn from '../middlewares/isLoggedin'
import { chatbotController } from '../controllers/chatbotController';
const router = express.Router();

router.get('/search',isLoggedIn, searchData)
router.get('/:userId',isLoggedIn, getHabits);
router.post('/createHabit',isLoggedIn, createHabit);
router.put('/editHabit/:id',isLoggedIn, editHabit);
router.post('/logHabit/:id',isLoggedIn, logHabit);
router.delete('/deleteHabit/:id',isLoggedIn,deleteHabit);
router.delete('/undoLog/:habitId/:logId',isLoggedIn, undoLog);
router.get('/loggedData/:habitId',isLoggedIn, getLoggedData)
router.get('/resetHabits/:userId',isLoggedIn, resetHabits)
router.delete('/deleteAllData/:userId',isLoggedIn, deleteAllData)
router.post('/ask',chatbotController)

export default router;