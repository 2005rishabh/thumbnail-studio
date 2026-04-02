import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import AuthRouter from './routes/AuthRoutes';
import ThumbnailRouter from './routes/ThumnailRoutes';
import userRouter from './routes/UserRoutes';

const app = express();

// Middleware to ensure DB connection
app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Internal Server Error: Database connection failed" });
    }
});

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://thumbnail-studio-two.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', AuthRouter);
app.use('/api/thumbnails', ThumbnailRouter);
app.use('/api/users', userRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// Error handling middleware for CORS
app.use((err: any, req: Request, res: Response, next: any) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ message: 'CORS policy: This origin is not allowed' });
    } else {
        next(err);
    }
});

// Export the app for Vercel
export default app;

// For local development
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}