import nodemailer from 'nodemailer'
import { Email, Email_Pass } from '../config/ENV_variable.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Email,
        pass: Email_Pass
    },
    pool: {
        maxConnections: 1,
        maxMessages: 100,
        rateDelta: 2000,
        rateLimit: 5
    },
    socketTimeout: 10000,
    connectionTimeout: 10000,
    greetingTimeout: 10000
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
