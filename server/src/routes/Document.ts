import { Request, Response, Router } from "express";
import { authValidation } from "../middlewares/Auth";
import { generatePresignedPutUrl ,getPresignedGetUrl} from "../minio/minio";
import { getCurrentDate } from "./utils";
import { PrismaClient } from "@prisma/client"

const router = Router()
const client = new PrismaClient()

const gePresignedUrl = async (req: Request,res: Response) =>{
    const fileName = req.body.file
    const url = await generatePresignedPutUrl(fileName) 
    if(!url) res.json({success:false})
    else res.json({success: true, preSignedURL: url})
}

const getDocDetails = async (req: Request,res: Response) =>{
    const docId = req.params.docId;
    const userId = req.user?.userId;
    
    const doc = await client.docs.findFirst({
        where :{
            id: docId,
            userID: userId
        }
    })
    if(!doc) res.json({success: false, msg: "Doc does not exist", docPath: null})
        
    if(doc?.link){
        const url = await getPresignedGetUrl(doc.link)
        res.json({success: true, msg: "doc found", docPath: doc.link})
    }
    
}

const getAllDocuments = async (req: Request, res: Response) =>{
    const userId = req.user?.userId
    try{
        const response = await client.docs.findMany({
            where: {
                userID: userId 
            }
        })
        res.json({success: true, data: response})
    }
    catch(error){
        console.log(error)
        res.json({success:false, error: error})
    }
    
}
const saveNewDoc = async (req: Request,res: Response) => {
    const userId = req.user?.userId
    const filePath = req.body.filePath
    try {
        const response = await client.docs.create({
            data: {
                userID: userId,
                link: filePath,
                dateCreated: getCurrentDate(),
            },
        });

        res.json({
            success: true,
            data: response,
        })
    } catch (error: any) {
        console.error("Error saving document:", error);

        res.json({
            success: false,
            error: error.message || "An unknown error occurred",
        })
    }
};




//Routes
router.post("/add/get_presigned_url", authValidation ,gePresignedUrl)
router.post("/add/save_new_doc",authValidation,saveNewDoc)
router.get("/my_docs",authValidation, getAllDocuments)
router.get("/:docId",authValidation,getDocDetails)

//handles delete doc 
router.delete("/:docId")
//handles update the existing doc // moving things
router.post("/update/:docId",()=>{})


export { router as docRouter}