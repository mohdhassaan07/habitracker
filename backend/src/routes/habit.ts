import express from 'express';
import { createHabit, deleteHabit, editHabit, getHabits, getLoggedData, logHabit, searchData, undoLog } from '../controllers/habitController';
import isLoggedIn from '../middlewares/isLoggedin'
const router = express.Router();

router.get('/search',isLoggedIn, searchData)
router.get('/:userId',isLoggedIn, getHabits);
router.post('/createHabit',isLoggedIn, createHabit);
router.put('/editHabit/:id',isLoggedIn, editHabit);
router.post('/logHabit/:id',isLoggedIn, logHabit);
router.delete('/deleteHabit/:id',isLoggedIn,deleteHabit);
router.delete('/undoLog/:habitId/:logId',isLoggedIn, undoLog);
router.get('/loggedData/:habitId', getLoggedData)


export default router;