import nodemailer from 'nodemailer'
import { Email, NODEMAILER_API_KEY } from '../config/ENV_variable.js'




if (!NODEMAILER_API_KEY) {
    console.error('ERROR: SENDGRID_API_KEY is not set in environment variables!');
}

const transport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: Email,
        pass: NODEMAILER_API_KEY
    },
    connectionTimeout: 30000,
    socketTimeout: 30000
});

export const SendOtpToUser = async (data) => {
    const mailOptions = {
        from: Email,
        to: data.userEmail,
        subject: 'OTP To Register As Admin',
        text: data.otp,
        html: data.HTML
    }

    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('OTP Mail Error:', error)
                reject(error)
            } else {
                console.log('OTP Mail Sent Successfully:', info)
                resolve({ otp: data.otp, info })
            }
        })
    })
}
