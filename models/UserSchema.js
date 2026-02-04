import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    gender : {
        type : String,
        enum : ["Male" , "Female" , "Others"],
        required : true
    },
  
    MobileNum : {
        type : String,
        default : ''
    },

    
 
    
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    
    profile: {
        type: String,
        default: ""
    },

    randomNum: {
        type: String,
        required: true
    },
   
  
    

});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const Users = mongoose.model("Users", UserSchema);
