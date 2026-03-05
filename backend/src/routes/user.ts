import express from 'express';
import {createUser, googleLogin, signin, SignOut, subscription} from '../controllers/authController'
import { deleteUser, editUser, logMood } from '../controllers/userController';
import isLoggedin from '../middlewares/isLoggedin';
const router = express.Router();

router.post('/signup', createUser)
router.post('/signin', signin)
router.get('/googleLogin', googleLogin)
router.get('/signout', SignOut)
router.put('/editUser/:id',isLoggedin, editUser)
router.post('/logMood/:userId',isLoggedin, logMood)
router.delete('/deleteUser/:userId',isLoggedin, deleteUser)
router.post('/create-checkout-session', subscription)
export default router;