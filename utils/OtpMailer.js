import nodemailer from 'nodemailer'
import { Email, SENDGRID_API_KEY } from '../config/ENV_variable.js'

const transport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: SENDGRID_API_KEY
    }
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
