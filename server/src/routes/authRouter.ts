import { Router } from "express";
import { Auth } from "../lib/auth/auth";

const router = Router()
const auth = new Auth()

router.post("/signup", async (req, res) => {
    const user = req.body;
    if (!user.email || !user.password || !user.firstName) res.status(400).json({ success: false, msg: "email or password or firstname missing" });
    const response = await auth.signUpUser(user);
    if (!response) res.status(401).json({ success: false, msg: "Failed to create user" })
    res.json({ success: true, msg: "account successfully created" })
})

router.post("/login", async (req, res) => {
    const userCred = req.body;
    console.log(userCred)
    
    const result  = await auth.login(userCred.email, userCred.password)

    if (result?.success) res.json(result)
    else res.status(404).json(result)
})
router.get("/validate_token", async (req, res) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ succes: false, error: 'Authorization header missing' });
    }

    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(403).json({ error: 'Token missing' });
    }
    else {
        const validUser = await auth.validateUser(token)
        if (validUser) res.json({ succes: true })
        else res.status(400).json({ succes: false })
    }
    
})

export {router as authRouter}