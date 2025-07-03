import express from 'express';
import { createHabit, deleteHabit, editHabit, getHabits, logHabit, undoLog } from '../controllers/habitController';
import isLoggedIn from '../middlewares/isLoggedin'
const router = express.Router();

router.get('/:userId',isLoggedIn, getHabits);
router.post('/createHabit',isLoggedIn, createHabit);
router.put('/editHabit/:id',isLoggedIn, editHabit);
router.post('/logHabit/:id',isLoggedIn, logHabit);
router.delete('/deleteHabit/:id',isLoggedIn,deleteHabit);
router.delete('/undoLog/:habitId/:logId',isLoggedIn, undoLog);
export default router;