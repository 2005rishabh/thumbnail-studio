import express from 'express';
import { getThumbnailbyId, getUsersThumbnails } from '../controllers/userController';
import protect from '../middlewares/auth';

const userRouter = express.Router();

userRouter.get('/thumbnails', protect, getUsersThumbnails);
userRouter.get('/thumbnails/:id', protect, getThumbnailbyId);

export default userRouter;