import mongoose from "mongoose";
import { Admins } from "./models/AdminSchema.js";
import { Dburl } from "./config/ENV_variable.js";


const MONGO_URI = Dburl;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    
    await Admins.deleteOne({ email: "grachit736@gmail.com" });

    const admin = await Admins.create({
      adminUserName: "rachit.com",
      adminName: "Rachit Gupta",
      email: "grachit736@gmail.com",
      password: "Rachit123",           
      consent: true,
      randomNum: Math.floor(100000 + Math.random() * 900000).toString(),
      contactNo: ["8881788990"],
      dateOfBirth: new Date("2004-08-03"),
      gender: "Male"
    });

    console.log("Admin seeded successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
