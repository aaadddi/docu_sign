import { PrismaClient } from "@prisma/client"
import  jwt  from "jsonwebtoken"
import bcrypt from "bcrypt"
import { JWT_SECRET } from "./config"
type newUserInfo = {
    email : string,
    firstName: string,
    lastName: string,
    password: string
}
export class Auth{
    
    client = new PrismaClient()
    
    async #encryptPassword(password: string) {
        try {
          const hash = await bcrypt.hash(password, 10);
          return hash;
        } catch (err) {
          throw new Error("Error hashing password");
        }
      }
    
    async signUpUser({email, firstName, lastName, password}: newUserInfo){
        try{
            await this.client.user.create({
                data:{
                    email: email,
                    firstName: firstName,
                    LastName: lastName,
                    pasword: await this.#encryptPassword(password),
                    dateJoined : (new Date()).toString()
                }
            })
        }
        catch(error){
            console.error(error)
            return false
        }
        return true
        
    }
    async login(email: string, password: string){
        const user = await this.client.user.findFirst({
            where: {
                email: email,
            }
        })
        
        if(user){
            const isMatch = await bcrypt.compare(password, user.pasword);
            const token = jwt.sign({ userId: user.id, email: user.email }, JSON.stringify(JWT_SECRET) , { expiresIn: '10h' });
            console.log(token)
            if(isMatch && token) return {success: true,token, error: ""};
        }
        else{
            return {success: false,error: "user does not exist", token: ""}
        }
    }
    async validateUser(token: string){
        try {
            const decoded = jwt.verify(token, JSON.stringify(JWT_SECRET));
            console.log("Valid token:", decoded);
            return true
          } catch (err : any) {
            console.log("Invalid token:", err.message);
            return false
          }
    }
    // async decodeToken(token: string) {
    //     try {
    //         const decoded = await new Promise((resolve, reject) => {
    //             jwt.verify(token, JWT_SECRET, (err, decoded) => {
    //                 if (err) {
    //                     return reject(err);
    //                 }
    //                 resolve(decoded);
    //             });
    //             console.log(decoded)
    //             console.log(decoded)
    //             return decoded;
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }

}