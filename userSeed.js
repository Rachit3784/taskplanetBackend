import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Users } from "./models/UserSchema.js";

async function seedUsers() {
    await mongoose.connect("");

    const passwordHash = await bcrypt.hash("Hello123", 10);

    const users = [
        {
            username: "achit01",
            fullname: "Achit Shukla",
            email: "achit01@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Loves coding and exploring new technologies.",
            UserKeyWord: ["coding", "tech", "innovation"]
        },
        {
            username: "ruchit22",
            fullname: "Ruchit Sharma",
            email: "ruchit22@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Enjoys traveling and photography.",
            UserKeyWord: ["travel", "camera", "lifestyle"]
        },
        {
            username: "surachit33",
            fullname: "Surachit Verma",
            email: "surachit33@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Passionate about fitness and healthy living.",
            UserKeyWord: ["fitness", "health", "gym"]
        },
        {
            username: "mr_boss44",
            fullname: "Aviral Boss",
            email: "boss44@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "A creative thinker and problem solver.",
            UserKeyWord: ["creative", "leader", "strategy"]
        },
        {
            username: "rahit55",
            fullname: "Rahit Kumar",
            email: "rahit55@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Tech enthusiast and fast learner.",
            UserKeyWord: ["tech", "AI", "learning"]
        },
        {
            username: "rakul66",
            fullname: "Rakul Mehta",
            email: "rakul66@example.com",
            gender: "Female",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Enjoys music and reading novels.",
            UserKeyWord: ["music", "reading", "calm"]
        },
        {
            username: "ranikul77",
            fullname: "Ranikul Singh",
            email: "ranikul77@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Entrepreneur mindset with a passion for business.",
            UserKeyWord: ["business", "startup", "growth"]
        },
        {
            username: "achitPro88",
            fullname: "Achit Verma",
            email: "achitpro88@example.com",
            gender: "Male",
            password: passwordHash,
            randomNum: generateRandomNum(),
            UserDescription: "Loves solving complex backend problems.",
            UserKeyWord: ["nodejs", "backend", "performance"]
        }
    ];

    try {
        await Users.insertMany(users);
        console.log("Users inserted successfully!");
    } catch (err) {
        console.error("Error inserting users:", err);
    }

    mongoose.connection.close();
}

function generateRandomNum() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

seedUsers();
