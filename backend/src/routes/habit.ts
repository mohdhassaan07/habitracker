import express from 'express';
import { createHabit, editHabit, getHabits, logHabit } from '../controllers/habitController';
import isLoggedIn from '../middlewares/isLoggedin'
const router = express.Router();

router.get('/:userId', getHabits);
router.post('/createHabit',isLoggedIn, createHabit);
router.put('/editHabit/:id', editHabit);
router.get('/logHabit/:id', logHabit);

export default router;