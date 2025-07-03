import express from 'express';
import { createHabit, deleteHabit, editHabit, getHabits, logHabit } from '../controllers/habitController';
import isLoggedIn from '../middlewares/isLoggedin'
const router = express.Router();

router.get('/:userId', getHabits);
router.post('/createHabit',isLoggedIn, createHabit);
router.put('/editHabit/:id', editHabit);
router.post('/logHabit/:id', logHabit);
router.delete('/deleteHabit/:id',deleteHabit)
export default router;