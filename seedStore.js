import mongoose from "mongoose";

import { Dburl } from "./config/ENV_variable.js";
import { StoreModel } from "./models/StoreSchema.js";

// 🔹 MONGO CONNECTION URL
const MONGO_URI = Dburl; // 🔥 change your DB name

// 🔹 OWNER INFO
const OWNER = {
  _id: "695b5cfc4f3121f197d690f9",
  fullname: "Rachit Gupta",
  email: "grachit736@gmail.com",
  contact: "9999999999"
};

// 🔹 STORES DATA
const stores = [
  {
    StoreName: "Fresh Mart",
    StoreUniqueNameId: "fresh-mart",
    Is24Hours: false,
    OpeningTime: "08:00 AM",
    ClosingTime: "11:00 PM"
  },
  {
    StoreName: "Daily Basket",
    StoreUniqueNameId: "daily-basket",
    Is24Hours: false,
    OpeningTime: "07:00 AM",
    ClosingTime: "10:30 PM"
  },
  {
    StoreName: "Urban Needs",
    StoreUniqueNameId: "urban-needs",
    Is24Hours: true,
    OpeningTime: "",
    ClosingTime: ""
  },
  {
    StoreName: "Health Plus",
    StoreUniqueNameId: "health-plus",
    Is24Hours: false,
    OpeningTime: "09:00 AM",
    ClosingTime: "09:00 PM"
  },
  {
    StoreName: "Quick Essentials",
    StoreUniqueNameId: "quick-essentials",
    Is24Hours: false,
    OpeningTime: "08:30 AM",
    ClosingTime: "10:00 PM"
  }
];

// 🔹 SEED FUNCTION
const seedStores = async () => {
  try {
    // 1️⃣ Connect to Mongo
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");

    // 2️⃣ Loop over stores and insert
    for (const store of stores) {
      const exists = await StoreModel.findOne({
        StoreUniqueNameId: store.StoreUniqueNameId
      });

      if (exists) {
        console.log(`⚠️ Store already exists: ${store.StoreName}`);
        continue;
      }

      const newStore = await StoreModel.create({
        StoreName: store.StoreName,
        StoreUniqueNameId: store.StoreUniqueNameId,

        OwnerName: OWNER.fullname,
        OwnerId: OWNER._id,
        OwnerEmail: OWNER.email,
        OwnerContactNumber: OWNER.contact,

        StoreEmail: OWNER.email,           // ✅ same as owner
        StoreContactNumber: OWNER.contact,

        Is24Hours: store.Is24Hours,
        OpeningTime: store.OpeningTime,
        ClosingTime: store.ClosingTime
      });

      console.log(`✅ Store created: ${newStore.StoreName}`);
    }

    // 3️⃣ Close connection
    await mongoose.connection.close();
    console.log("🎉 Store feed completed and MongoDB connection closed");

  } catch (error) {
    console.error("❌ Store feed error:", error);
    mongoose.connection.close();
  }
};

// Run seed
seedStores();
