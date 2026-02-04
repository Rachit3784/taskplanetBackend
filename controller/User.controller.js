import { Users } from "../models/UserSchema.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import mongoose from "mongoose";
import { SendOtpToUser } from "../utils/OtpMailer.js";
import { privateKey } from "../config/ENV_variable.js";


const htmlTemplate = (otp) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TaskPlanet OTP</title>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg,#0d1f44 0%, #1e3a8a 50%, #2563eb 100%);font-family: 'Poppins', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.15);overflow:hidden;border:1px solid #e0e7ff;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;background:linear-gradient(135deg,#2563eb,#3b82f6,#60a5fa);position:relative;overflow:hidden;text-align:center;">
              <div style="font-size:28px;font-weight:800;color:white;text-shadow:0 2px 10px rgba(0,0,0,0.2);">🌎 TaskPlanet</div>
              <div style="font-size:14px;color:white;margin-top:4px;font-weight:500;opacity:0.9;">Your Social Brand Hub</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;color:#1e293b;">
              <h1 style="margin:0 0 16px 0;font-size:26px;font-weight:700;color:#111827;">Hello, TaskPlanet User 👋</h1>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#374151;">
                Your OTP to access TaskPlanet is ready. Enter this code to verify your account and continue exploring your social brand world.
              </p>

              <!-- OTP Box -->
              <div style="margin:16px 0 28px 0;padding:20px 0;border-radius:16px;background:#f0f9ff;text-align:center;box-shadow:0 4px 20px rgba(37,99,235,0.1);border:1px solid #60a5fa;">
                <div style="font-size:14px;color:#2563eb;font-weight:600;margin-bottom:8px;letter-spacing:0.5px;text-transform:uppercase;">Your OTP Code</div>
                <div style="font-family:'Courier New', monospace;font-size:36px;letter-spacing:8px;font-weight:700;color:#1e3a8a;">
                  ${otp}
                </div>
                <div style="font-size:13px;color:#3b82f6;margin-top:8px;font-style:italic;">Valid for the next 5 minutes</div>
              </div>

              <p style="margin:28px 0 0 0;font-size:16px;color:#374151;line-height:1.6;">
                Keep this code safe. Your TaskPlanet journey awaits! 🚀
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px;color:#6b7280;background:#f0f9ff;border-top:1px solid #60a5fa;text-align:center;">
              <hr style="border:none;height:1px;background:#c7d2fe;margin:12px 0 20px 0;border-radius:2px;">
              <div style="font-size:13px;color:#6b7280;line-height:1.5;">
                If you did not request this OTP, please ignore this email.
              </div>
              <div style="margin-top:8px;font-size:13px;color:#6b7280;">
                © 2026 TaskPlanet — Your Social Brand Companion
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;



const generateOtp = () => {
  let j = '';
  for (let i = 0; i < 6; i++) {
    j += Math.floor(Math.random() * 10).toString();
  }
  return j;
};





const LocalOTP = new Map();
const LocalTimeouts = new Map();

export const CreateUser = async (req, res) => {
  try {
    const { username, fullname, email, password , gender } = req.body;
     console.log({ username, fullname, email, password , gender } )
    // 1. Input validation
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({ msg: "Details are missing" });
    }

    
    const exist = await Users.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

  
    const hashPassword = await bcrypt.hash(password, 10);
    const Otp =  generateOtp();
    const html = htmlTemplate(Otp)
    
    const result =  await SendOtpToUser({ otp : Otp, HTML: html, userEmail: email });

    
    if (!result || !result.info.messageId) {
      return res.status(400).json({ msg: "Failed to send OTP email" });
    }

    
    LocalOTP.set(email, {
      myotp: result.otp,
      username,
      fullname,
      hashPassword,
      gender,
      
    });

    
    const existingTimeout = LocalTimeouts.get(email);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      LocalTimeouts.delete(email);
    }

    const timeout = setTimeout(() => {
      LocalOTP.delete(email);
    }, 5 * 60 * 1000); // 2 minutes

    LocalTimeouts.set(email, timeout);

    // 9. Respond to client
    return res.status(200).json({
      msg: "OTP sent to your email",
      success : true
    });

  } catch (error) {
    console.error("CreateUser Error:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};



export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Hitted this function")
    console.log(otp)
    const exist = LocalOTP.get(email);
    
    if (!exist) {
      return res.status(400).json({
        msg: "Invalid OTP or OTP expired",
      });
    }

    console.log(exist.myotp)

    if (otp !== exist.myotp) {
      return res.status(400).json({
        msg: "Incorrect OTP",
      });
    }

    let randomNum = '';
    for (let i = 0; i < 5; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }


    console.log("yaha tak aa gae")
    const data = await Users.create({
      username: exist.username,
      fullname: exist.fullname,
      password: exist.hashPassword,
      gender : exist.gender,
      email,
      randomNum
    });




   



    
    console.log("yahabbhbsjbh")


    
   
    
    const mytoken = jwt.sign(
      { userId: data._id, email, randomNum },
      privateKey,
      { expiresIn: '30d', algorithm : 'RS256'}
    );
   
  
    res.cookie('token', mytoken, {
      httpOnly: true,
    
    });

    
    LocalOTP.delete(email);
    LocalTimeouts.delete(email);
    
    return res.status(200).json({
      success: true,
      msg: "Account created successfully",
      detail : data ,
      
  token: mytoken
    });

    

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error"
    });
  }
};




export const LoginWithCookie = async (req,res)=>{

try{

  const user = req.MatchedUser;
console.log(user,"kkkkkkkkkkkkk")

const data = await Users.findById(user.userId);

  if(user){
    return res.status(200).json({
      msg : "Logged In",
      userdata : data,
      success : true
    })
  }
  
  else{
    return res.status(400).json({
      msg : "Failed to Logged In",
      
      success : false
    })
  }

}catch(error){
  console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      success : false
    });
}

}





export const LoginUser = async (req, res) => {
  try {
    console.log("Login Function Hitted By User")
    const { email, password } = req.body;
     console.log(email,password)
    // 1. Input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email or Password missing" });
    }

    // 2. Find user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 4. Generate new randomNum for session freshness
    let randomNum = '';
    for (let i = 0; i < 5; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }

    user.randomNum = randomNum;
    await user.save();



    // 5. Generate token
    const mytoken = jwt.sign(
      { userId: user._id, email: user.email, randomNum },
      privateKey,
     { expiresIn: '30d', algorithm : 'RS256'}
    );


    
  

    // 6. Set cookie
    res.cookie('token', mytoken, {
      httpOnly: true,
      
    });

    return res.status(200).json({
      success: true,
      msg: "Login successful alalalala",
      detail : user,
      token : mytoken ,
        
     
    });
  } catch (error) {
    console.error("LoginUser Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ----------------- forgetPasswordRequest -----------------
export const forgetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // 1. Check if user exists
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "No account found with this email" });
    }

    // 2. Send OTP via email

    const otp = await generateOtp();
    const html = htmlTemplate(otp)
    const { Otp, info } = await SendOtpToUser({otp, HTML: html, userEmail: email })
    if (!info || !info.messageId) {
      return res.status(400).json({ msg: "Failed to send OTP email" });
    }

    // 3. Store OTP in memory
    LocalOTP.set(email, { myotp: Otp, userId: user._id });

    // Clear old timeout if exists
    const existingTimeout = LocalTimeouts.get(email);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      LocalTimeouts.delete(email);
    }

    // Expire OTP in 2 mins
    const timeout = setTimeout(() => {
      LocalOTP.delete(email);
    }, 5 * 60 * 1000);

    LocalTimeouts.set(email, timeout);

    return res.status(200).json({ msg: "OTP sent to your email", success: true });
  } catch (error) {
    console.error("forgetPasswordRequest Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" , success : false});
  }
};

// ----------------- AccountRecover -----------------
export const AccountRecover = async (req, res) => {
  try {
    const { identifier } = req.body; // can be either email OR username

    if (!identifier) {
      return res.status(400).json({ msg: "Provide username or email" });
    }

    // Search by email OR username
    const user = await Users.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(404).json({ msg: "Account not found", success: false });
    }

    return res.status(200).json({
      msg: "Found account",
      success: true,
      account: {
        username: user.username,
        email: user.email,
        profileUrl: user.profileUrl || null, // in case profile picture available
      }
    });
  } catch (error) {
    console.error("AccountRecover Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};




export const verifyForgetPassUserOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("Hitted this function");

        const exist = LocalOTP.get(email);

        if (!exist) {
            return res.status(400).json({
                msg: "Invalid OTP or OTP expired", success: false
            });
        }

        if (otp !== exist.myotp) {
            return res.status(400).json({
                msg: "Incorrect OTP",
                success: false
            });
        }

        // ✅ IMPORTANT: Do not delete the OTP here. Mark it as verified instead.
        LocalOTP.set(email, { ...exist, verified: true });

        return res.status(200).json({ msg: "OTP has been verified", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false
        });
    }
};


export const actionOnforgetPass = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Hitted this function");
        console.log({ email, password });
        
        const exist = LocalOTP.get(email);
        
        // ✨ Check for both existence and the 'verified' flag
        if (!exist || !exist.verified) {
            return res.status(400).json({
                msg: "Invalid request, OTP not verified or timeout", 
                success: false
            });
        }

        let randomNum = '';
        for (let i = 0; i < 5; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }
        
        let data;
        if (password) {
            const hashedPass = await bcrypt.hash(password, 10);
            data = await Users.findOneAndUpdate(
                { _id: exist.userId }, // Use the user ID from LocalOTP for a more secure lookup
                { $set: { password: hashedPass } },
                { new: true }
            );
        }
        
        if (!data) {
            return res.status(404).json({
                msg: "User not found or update failed.",
                success: false
            });
        }
       
        const mytoken = jwt.sign(
            { userId: data._id, email: data.email },
            privateKey,
            { expiresIn: '30d', algorithm : 'RS256'}
        );

        
        res.cookie('token', mytoken, {
            httpOnly: true,
            // secure: true, // uncomment in production
            // sameSite: 'Strict'
        });
        
        // ✅ Finally, clean up OTP and timeout after a successful password reset
        LocalOTP.delete(email);
        
        const existingTimeout = LocalTimeouts.get(email);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            LocalTimeouts.delete(email);
        }

        return res.status(200).json({
            success: true,
            msg: "Password updated successfully",
            detail: data,
            token: mytoken,
            
          
        });
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false
        });
    }
};



export const updateProfile = async (req,res)=>{

  
  try{


    const { userRole , userDescription , email } = req.body;

     if(!email) return res.status(400).json({msg : "email not exist" , success : false});
    if(!userRole && !userDescription ) return res.status(400).json({msg : "no detail provided" , success : false});

    const update = await Users.findOneAndUpdate({email : email} , {$push : {UserKeyWord : userRole } , $set : {UserDescription : userDescription} } , {new : true})

    console.log(update)

    if(!update) return res.status(400).json({msg : "No User Exist with this email" , success : false });

    return res.status(200).json({
      msg : "Details for Profile is Updated" , success : true , data : update
    })

  }catch(error){

console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
      success : false
    });

  }
}





export const UpdateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, UserDescription, UserKeyWord } = req.body;
  console.log(userId , UserDescription , UserKeyWord)
    if (!userId) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "Bad request - Missing userId", success: false });
    }

    
  const text = UserDescription + UserKeyWord.join(",")

   


    const user = await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { UserDescription: UserDescription || "", UserKeyWord: UserKeyWord || [] , embeddings : response.embeddings} },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "User not found or updated", success: false });
    }

    // await UserEmbedding.create(
    //   [
    //     {
    //       userId: user._id,
    //       embeddings: response.embeddings,
    //     },
    //   ],
    //   { session }
    // );

    await session.commitTransaction();

    return res.status(200).json({ msg: "User Updated", success: true , result : user  });

  } catch (error) {
    console.error("UpdateUser Error:", error);
    await session.abortTransaction();
    return res.status(500).json({
      msg: "Internal Server Error",
      success: false,
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};




export const UserInfoSearch = async (req,res)=>{
  try{

    const {userId} = req.query;

    const FindUser = await Users.findById(userId)

    return res.status(200).json({msg : 'Fetched' , success : true , user : FindUser});

  }catch(error){
    console.log(error)
    return res.status(500).json({msg : 'Internal Server Error' , success : false});
  }
}