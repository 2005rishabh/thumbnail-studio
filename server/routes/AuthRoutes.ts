import express from 'express';
import { loginUser, verifyUser, logoutUser, registerUser } from '../controllers/authControllers';
import protect from '../middlewares/auth';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);
AuthRouter.get('/verify', protect, verifyUser);
AuthRouter.post('/logout', protect, logoutUser);

export default AuthRouter;