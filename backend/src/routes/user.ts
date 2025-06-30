import express from 'express';
import {createUser, signin, SignOut} from '../controllers/authController'
const router = express.Router();


router.post('/signup', createUser)
router.post('/signin', signin)
router.get('/signout', SignOut)
export default router;