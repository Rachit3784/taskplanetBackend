import mongoose from "mongoose";

import { Dburl } from "./config/ENV_variable.js";
import { ParentCategory } from "./models/ParantCategory.js";

const MONGO_URI = Dburl;

/* -------------------- CATEGORY TITLES -------------------- */
const CATEGORY_TITLES = [
  "Grocery & Kitchen",
  "Snack & Drink",
  
];


const groceryKitchen = [
  {
    CategoryName: "Vegetables & Fruits",
    CategoryCoverImage: "https://www.lalpathlabs.com/blog/wp-content/uploads/2019/01/Fruits-and-Vegetables.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Atta , Rice & Dal",
    CategoryCoverImage:
      "https://img.thecdn.in/344986/cat/1705405028411_350633_cat.png?format=webp",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Oil , Ghee & Masala",
    CategoryCoverImage:
      "https://kalashthesupermarket.com/CategoryImages/25002024_339118641nhu3e5v.u2q.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Dairy, Bread and Eggs",
    CategoryCoverImage:
      "https://jrcashncarry.com/wp-content/uploads/2023/06/Dairy-Bread-Eggs.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Biscuits and bakery",
    CategoryCoverImage:
      "https://m.media-amazon.com/images/I/61-IvODJD5L.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Dry Fruits & Cereals",
    CategoryCoverImage:
      "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b35ecb75b961421902aac8/8901088213608_1.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
  {
    CategoryName: "Kitchenware and bottles",
    CategoryCoverImage:
      "https://m.media-amazon.com/images/I/81tlqupEr8L.jpg",
    CategoryTitle: "Grocery & Kitchen",
  },
];

const snackDrink = [
  {
    CategoryName: "Chips and Namkeens",
    CategoryCoverImage: "https://services.kpnfresh.com/media/v1/categories/images/8489cd56-a168-4fc5-a7c0-3e2a54b7642e/chips-namkeens.webp?c_type=C1",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Chocolates",
    CategoryCoverImage: "https://images-eu.ssl-images-amazon.com/images/I/51ALq5g9l2L._AC_UL375_SR375,375_.jpg",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Drinks and Juice",
    CategoryCoverImage: "https://images-eu.ssl-images-amazon.com/images/I/61ICqwIbmyL._AC_UL900_SR615,900_.jpg",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Instant Foods",
    CategoryCoverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-7NQv4Jf6IueVRTLWh-TpMi_LlEmJQKkEQ&s",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Sauces and Spreads",
    CategoryCoverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FZe1dqNhXctoRcvs2oHMnowdtYIBkK643w&s",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Paan Corner",
    CategoryCoverImage: "https://5.imimg.com/data5/SELLER/Default/2021/8/HH/RM/HZ/61269664/candy.jpg",
    CategoryTitle: "Snacks and Drinks",
  },
  {
    CategoryName: "Ice Creams and More",
    CategoryCoverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyoMyB5KW3LLkjeMnAimzkVeW5g-PAZpfB9Q&s",
    CategoryTitle: "Snacks and Drinks",
  },
];



/* -------------------- COMBINE ALL (45 DOCS) -------------------- */
const allData = [
  ...groceryKitchen,
  ...snackDrink,
];

/* -------------------- SEED FUNCTION -------------------- */
const seedParentCategory = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    await ParentCategory.deleteMany({});
    console.log("🗑️ Old data cleared");

    await ParentCategory.insertMany(allData);
    console.log("🌱 45 ParentCategory documents inserted successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedParentCategory();
