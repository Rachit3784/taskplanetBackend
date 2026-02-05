import dotenv from 'dotenv'
dotenv.config();
export const PORT = process.env.PORT;
export const publicKey = process.env.JWT_PUBLIC_KEY;
export const privateKey = process.env.JWT_PRIVATE_KEY;
export const Dburl = process.env.DBURL;
export const Email = process.env.EMAIL;
export const NODEMAILER_API_KEY = process.env.NODEMAILER_API_KEY;
export const Cloudinary_API_Key=process.env.Cloudinary_API_Key
export const Cloudinary_Name= process.env.Cloudinary_Name
export const Cloudinary_Secret=process.env.Cloudinary_Secret