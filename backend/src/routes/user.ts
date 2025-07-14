import express from 'express';
import {createUser, editUser, signin, SignOut} from '../controllers/authController'
import isLoggedin from '../middlewares/isLoggedin';
const router = express.Router();

router.post('/signup', createUser)
router.post('/signin', signin)
router.get('/signout', SignOut)
router.put('/editUser/:id',isLoggedin, editUser)
export default router;