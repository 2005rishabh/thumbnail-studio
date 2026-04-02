import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const sendToken = (req: any, res: Response, userId: string, message: string) => {
    const token = generateToken(userId);

    const origin = req.get('origin');
    const isLocalhost = origin?.includes('localhost') || !origin;

    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: !isLocalhost, // Secure only if not localhost
        sameSite: (isLocalhost ? 'lax' : 'none') as 'none' | 'lax',
        path: '/',
    };

    res.cookie('token', token, cookieOptions);

    return token;
};
