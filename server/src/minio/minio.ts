import * as Minio from 'minio'
import dotenv from 'dotenv'

dotenv.config()

const minioConfig = {
    endPoint: process.env.minioEndPoint || "localhost",
    port: parseInt(process.env.minioPort || "53007"),
    useSSL: process.env.minioUseSSL === "true",
    accessKey: process.env.minioAccessKey || (() => { 
        throw new Error('minio accessKey is not defined'); 
      })(),
    secretKey: process.env.minioSecretKey ||(() => { 
        throw new Error('minio secretKey is not defined'); 
      })(),
    region: ""
}

const minioClient = new Minio.Client(minioConfig)
const bucket = "kreakdocuments"

export const generatePresignedPutUrl = async (fileName: string) => {
    try{
    const url = await minioClient.presignedPutObject(bucket, fileName, 60*60)
    return url
}
    catch(error) {throw error}
}
export const getPresignedGetUrl = async (fileName: string) =>{
    try{
      const url = await minioClient.presignedGetObject(bucket,fileName, 60*60*24)
      return url
    }
    catch(error) {
      throw error
    }
}