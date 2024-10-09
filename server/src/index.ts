import express from "express";
import cors from 'cors'
import { docRouter } from "./routes/Document";
import { authRouter } from "./routes/Auth";
import dotenv from 'dotenv';
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/v1/doc", docRouter)
app.use("/api/v1/auth", authRouter)

app.listen(3001)