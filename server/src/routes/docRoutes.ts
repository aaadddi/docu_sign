import { Router } from "express";
import Document from "../lib/document/document";
import { Auth } from "../lib/auth/auth";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "../lib/auth/config";
// import { DecodeOptions } from "jsonwebtoken";
const router = Router()
const auth = new Auth()
const docs = new Document()
async function decodeToken(token: string): Promise<any> {
    console.log(">>>",token)
    try {
        const decoded: any = await new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
        return decoded; 
    } catch (error) {
        throw error; 
    }
}
router.post("/newDoc",async (req,res) =>{
    const file = req.body?.files;
    const token = req.headers.authorization?.split(" ")[1]
    if(!token) res.status(401).json({success: false, msg: "Authorisation failes"})
    else{
        const res = await decodeToken(token)
    // const userInfo :{id:string} = await auth.decodeToken(token)
    // const userID = userInfo?.id
    // const result = await docs.newDocument({userID,file})
    // console.log(result) 
    }
    
 })

export { router as docRouter}