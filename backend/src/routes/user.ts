import express from 'express';
import {createUser, signin, SignOut} from '../controllers/authController'
import { editUser, logMood } from '../controllers/userController';
import isLoggedin from '../middlewares/isLoggedin';
const router = express.Router();

router.post('/signup', createUser)
router.post('/signin', signin)
router.get('/signout', SignOut)
router.put('/editUser/:id',isLoggedin, editUser)
router.post('/logMood/:userId',isLoggedin, logMood)
export default router;