import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const getCurrentDate = (): Date => {
  return new Date()
};

async function encryptPassword(password: string) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    throw new Error("Error hashing password");
  }
}

function decodeToken(token: string, JWT_SECRET: string): Promise<any> {
  try {
    const decoded: any = jwt.verify(token, JSON.stringify(JWT_SECRET), { algorithms: ['HS256'] });
    return decoded;
  } catch (error) {
    throw error;
  }
}



export { encryptPassword, decodeToken }