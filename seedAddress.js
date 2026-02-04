import mongoose from "mongoose";


import { Dburl } from "./config/ENV_variable.js";
import { AddressModel } from "./models/AddressSchema.js";
import { StoreModel } from "./models/StoreSchema.js";

// 🔹 MongoDB Connection
const MONGO_URI = Dburl; // 🔥 change DB name

// 🔹 Stores info
const stores = [
  {
    storeId: "6967dd370c8d41f21d804863",
    name: "Fresh Mart",
    addressName: "New Shastri Nagar",
    fullAddress: "Shastri Nagar, Jabalpur, Madhya Pradesh 482003",
    coordinates: [79.875461, 23.142027] // [lng, lat]
  },
  {
    storeId: "6967dd380c8d41f21d804866",
    name: "Daily Basket",
    addressName: "Civil Line",
    fullAddress: "Satna, Madhya Pradesh 485001",
    coordinates: [80.811401, 24.590039]
  },
  {
    storeId: "6967dd380c8d41f21d804869",
    name: "Urban Needs",
    addressName: "Unchehra Bus Stand",
    fullAddress: "Unchehra, Majhakpa, Madhya Pradesh 485661",
    coordinates: [80.785081, 24.383287]
  },
  {
    storeId: "6967dd380c8d41f21d80486c",
    name: "Health Plus",
    addressName: "Govraon Kalan",
    fullAddress: "Madhya Pradesh",
    coordinates: [80.783852, 24.434815]
  },
  {
    storeId: "6967dd380c8d41f21d80486f",
    name: "Quick Essentials",
    addressName: "Civil Line",
    fullAddress: "Satna, Madhya Pradesh 485001",
    coordinates: [80.811401, 24.590039]
  }
];

// 🔹 Seed function
const feedStoreAddresses = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");

    for (const store of stores) {
      // check if store exists
      const storeDoc = await StoreModel.findById(store.storeId);
      if (!storeDoc) {
        console.log(`⚠️ Store not found: ${store.storeId}`);
        continue;
      }

      // check if address already exists for this store
      const exists = await AddressModel.findOne({
        ownerId: store.storeId,
        ownerType: "Stores"
      });
      if (exists) {
        console.log(`⚠️ Address already exists for store: ${store.name}`);
        continue;
      }

      // create address
      const newAddress = await AddressModel.create({
        ownerId: store.storeId,
        ownerType: "Stores",
        name: store.addressName,
        addressType: "others",
        addressLine1: store.fullAddress,
        state: "Madhya Pradesh",
        city: store.fullAddress.split(",")[1] || "",
        pincode: store.fullAddress.match(/\d{6}/)?.[0] || "",
        location: {
          type: "Point",
          coordinates: store.coordinates
        }
      });

      // update store with this address
      storeDoc.address = newAddress._id;
      await storeDoc.save();

      console.log(`✅ Address created & linked for store: ${store.name}`);
    }

    console.log("🎉 All addresses seeded and linked successfully");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding addresses:", error);
    mongoose.connection.close();
  }
};

// Run seed
feedStoreAddresses();
