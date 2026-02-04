import mongoose from "mongoose";

import { Dburl } from "./config/ENV_variable.js";
import { CategoryModel } from "./models/CategorySchema.js";

const MONGO_URI = Dburl;

// Parent Category ID (Vegetables & Fruits)
const PARENT_CATEGORY_ID = "6967df9f2529eac9e0187d05";

const categories = [
  {
    SubCategoryName: "Soft Drinks",
    SubCategoryCoverImage:
      "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/8d39e7a7-709a-489e-8692-a8c3a7947210.png",
  },
  {
    SubCategoryName: "Fruit Juice",
    SubCategoryCoverImage:
      "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/e6f39427-bbde-4e01-941d-2bfebece7ff0.png",
  },
  {
    SubCategoryName: "Water & Ice Cubes",
    SubCategoryCoverImage:
      "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/2faf253a-7e5b-4d53-9774-350add8d50b5.png",
  }]

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    const docs = categories.map((cat) => ({
      ...cat,
      ParentCategoryId: PARENT_CATEGORY_ID,
    }));

    await CategoryModel.insertMany(docs);

    console.log("🎉 20 Sub-Categories seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedCategories();
