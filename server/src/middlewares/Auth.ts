
import { decodeToken } from "../routes/utils";
import { NextFunction } from "express";
import { config } from "dotenv";
config()
const JWT_SECRET = process.env.JWT_SECRET || ""

export const authValidation = async (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
        return res.status(400).json({ message: 'Invalid authorization header format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const user = decodeToken(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};