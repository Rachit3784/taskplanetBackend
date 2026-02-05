import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY, EMAIL_USER } from "../config/ENV_variable.js";

sgMail.setApiKey(SENDGRID_API_KEY);

export const SendOtpToUser = async ({ otp, HTML, userEmail }) => {
  const msg = {
    to: userEmail,
    from: EMAIL_USER, // must be verified in SendGrid
    subject: "OTP To Register As Admin",
    text: `Your OTP is ${otp}`,
    html: HTML,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ OTP Mail Sent:", response[0].statusCode);

    return {
      otp,
      info: response[0], // success info
    };
  } catch (error) {
    console.error("❌ OTP Mail Error:", error.response?.body || error);
    throw error;
  }
};
