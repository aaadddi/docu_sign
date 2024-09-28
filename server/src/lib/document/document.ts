import { PrismaClient } from "@prisma/client"

export default class Document{
    client = new PrismaClient()
    newDocument({userID, file} :{
        userID : string,
        file: File
    }){
    
         
    }
}