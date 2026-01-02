import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoutes';
import ThumbnailRouter from './routes/ThumnailRoutes';
import userRouter from './routes/UserRoutes';


declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string;
    }
}

// Connect to Database
connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://thumbnail-studio-two.vercel.app'],
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: 'sessions',
    }),
}));

app.use(express.json());

app.use('/api/auth', AuthRouter);
app.use('/api/thumbnails', ThumbnailRouter);
app.use('/api/users', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});