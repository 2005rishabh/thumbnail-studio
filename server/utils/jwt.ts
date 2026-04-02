import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const sendToken = (res: Response, userId: string, message: string) => {
    const token = generateToken(userId);

    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
    };

    res.cookie('token', token, cookieOptions);

    return token;
};
