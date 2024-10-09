import { Router } from "express";
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { encryptPassword, decodeToken } from "./utils"
import { Request, Response } from "express"

const JWT_SECRET = process.env.JWT_SECRET
const client = new PrismaClient()
const router = Router()
async function signUp(req: Request, res: Response) {
    const user = req.body;
    if (!user || !user.email || !user.password || !user.firstName || !user.lastName) {
        res.json({ success: false, msg: "email or password or firstname missing" });
    }

    try {
        await client.user.create({
            data: {
                email: user.email,
                firstName: user.firstName,
                LastName: user.lastName,
                pasword: await encryptPassword(user.password),
                dateJoined: (new Date()).toString()
            }
        });
        res.json({ success: true, msg: "account successfully created" })
    }
    catch (error) {
        console.error(error)
        res.json({ success: false, msg: "Failed to create user" })
    }
}

async function login(req: Request, res: Response) {
    const user = req.body;
    const result = await client.user.findFirst({
        where: {
            email: user.email,
        }
    })

    if (!result) res.status(401).json({ success: false, error: "Invalid user" })
    const isMatch = await bcrypt.compare(user.password, result!.pasword);

    if (!isMatch) res.status(401).json({ success: false, error: "Incorrect password" })

    const token = jwt.sign({ userId: user.id, email: user.email, firstName: user.firstName, lastName: user.LastName }, JSON.stringify(JWT_SECRET), { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId: user.id }, JSON.stringify(JWT_SECRET), { expiresIn: '7d' });

    res.json({ success: true, token, refreshToken, error: "" })

}

async function validateUser(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.json({ succes: false, error: 'Authorization header missing' });
    }

    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.json({ error: 'Token missing' });
    }
    try {
        if (!JWT_SECRET) throw "JWT_SECRET is not defined"
        const decoded = await decodeToken(token!, JWT_SECRET)
        res.json({ success: true })

    } catch (err: any) {
        console.log("Invalid token:", err.message);
        res.json({ success: false })
    }
}

//Routes
router.post("/signup", signUp)
router.post("/login", login)
router.get("/validate_token", validateUser)

export { router as authRouter }