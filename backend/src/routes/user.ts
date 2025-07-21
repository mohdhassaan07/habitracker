import express from 'express';
import {createUser, signin, SignOut} from '../controllers/authController'
import { deleteUser, editUser, logMood } from '../controllers/userController';
import isLoggedin from '../middlewares/isLoggedin';
const router = express.Router();

router.post('/signup', createUser)
router.post('/signin', signin)
router.get('/signout', SignOut)
router.put('/editUser/:id',isLoggedin, editUser)
router.post('/logMood/:userId',isLoggedin, logMood)
router.delete('/deleteUser/:userId',isLoggedin, deleteUser)
export default router;