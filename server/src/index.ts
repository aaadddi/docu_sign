import express from "express";
import { Auth } from "./lib/auth/auth";
import cors from 'cors'
import { docRouter } from "./routes/docRoutes";
import { authRouter } from "./routes/authRouter";

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/v1/doc",docRouter)
app.use("/api/v1/auth",authRouter)

app.listen(3001)