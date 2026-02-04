import mongoose from "mongoose";
import { ProductModel } from "./models/ProductSchema.js";
import { VarientModel } from "./models/VarientSchema.js";
import { Dburl } from "./config/ENV_variable.js";

const MONGO_URI = Dburl;

/* ================= STORE IDS ================= */
const STORE_IDS = [
  "6967dd370c8d41f21d804863",
  "6967dd380c8d41f21d804866",
  "6967dd380c8d41f21d804869",
  "6967dd380c8d41f21d80486c",
  "6967dd380c8d41f21d80486f"
];

/* ================= CATEGORY MAP ================= */
/* Parent Category: Drinks & Juices -> 6967df9f2529eac9e0187d05 */
const CATEGORY_MAP = [
  {
    id: "6967e681f62343f3bf3e7e07",
    name: "Soft Drinks",
    parentId: "6967df9f2529eac9e0187d05"
  },
  {
    id: "6967e681f62343f3bf3e7e08",
    name: "Fruit Juice",
    parentId: "6967df9f2529eac9e0187d05"
  },
  {
    id: "6967e681f62343f3bf3e7e09",
    name: "Water & Ice Cubes",
    parentId: "6967df9f2529eac9e0187d05"
  }
];

/* ================= PRODUCTS ================= */
const PRODUCTS = [
  /* ---------------- SOFT DRINKS (catIndex: 0) ---------------- */
  {
    name: "Coca Cola Diet Coke Soft Drink",
    catIndex: 0,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/6771100f-3fad-40fb-80ff-4781de705832.png"
  },
  {
    name: "Appy Fizz Sparkling Drink",
    catIndex: 0,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/ccfce5a7-71da-489a-b06b-cb6506324ef2.png"
  },
  {
    name: "7UP Nimbooz with Lemon Juice",
    catIndex: 0,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/2e5f96c5-fa3d-4d72-a739-482275ea7662.png"
  },
  {
    name: "Frooti Mango Drink",
    catIndex: 0,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/9edf5044-9f5e-4b4d-a66b-d74049df8d50.png"
  },
  {
    name: "Sprite Lemon Plus",
    catIndex: 0,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/8b85b46d-c8a4-47f3-bf0b-12df8610e384.png"
  },

  /* ---------------- FRUIT JUICE (catIndex: 1) ---------------- */
  {
    name: "B Natural Mixed Fruit Juice",
    catIndex: 1,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/5cba0f37-689a-4217-b8cb-c8bac5be2570.png"
  },
  {
    name: "Real Fruit Power Cranberry Juice",
    catIndex: 1,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/c1ad8c18-1298-4996-a045-c01d58281f08.png"
  },
  {
    name: "Pluckk Sugarcane Cold Pressed Juice",
    catIndex: 1,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/d2d29620-5ace-4884-9cc2-18c080f824fd.png"
  },
  {
    name: "Paper Boat Swing",
    catIndex: 1,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/96c2b265-69bc-484a-9db0-da7e505fac94.png"
  },
  {
    name: "Raw Pressery Valencia Orange Juice",
    catIndex: 1,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/27dfae57-ce31-4974-bc1a-3d6f329512f0.png"
  },

  /* ---------------- WATER & ICE (catIndex: 2) ---------------- */
  {
    name: "Bisleri Packaged Drinking Water",
    catIndex: 2,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/2faf253a-7e5b-4d53-9774-350add8d50b5.png"
  },
  {
    name: "Aquafina Packaged Water",
    catIndex: 2,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/b343c33b-9443-4455-970c-000f8d84608e.png"
  },
  {
    name: "Himalayan Natural Mineral Water",
    catIndex: 2,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/124f5d93-74ee-41ac-b8a3-71926a2c0690.png"
  },
  {
    name: "Evocus Black Alkaline Water",
    catIndex: 2,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/c34b7dd9-21b1-4682-8c2d-c6e4d4d7fecb.png"
  },
  {
    name: "O'cean Mango & Passion Fruit Water",
    catIndex: 2,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/b1ccf83f-0e55-4b14-b1c4-de929735bde7.png"
  }
];

/* ================= VARIANT CONFIG ================= */
const AMOUNTS = ["500gm", "1kg", "5kg"];

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* ================= SEEDER ================= */
const seedProductsAndVariants = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    for (const storeId of STORE_IDS) {
      console.log(`\n🌟 Seeding for store: ${storeId}`);

      for (const product of PRODUCTS) {
        const category = CATEGORY_MAP[product.catIndex];

        /* -------- CREATE PARENT PRODUCT -------- */
        const parentProduct = await ProductModel.create({
          StoreOwnerId: storeId,
          StoreId: storeId,

          ProductDescription: [
            {
              title: product.name,
              subtitle: `Best quality ${product.name}`
            }
          ],

          ProductEmbeddings: Array.from({ length: 128 }, () => Math.random()),
          TotalReviews: randomInRange(0, 100),
          TimeToDelivar: `${randomInRange(1, 3)} days`
        });

        const variantIds = [];
        const variantCount = randomInRange(2, 3);

        /* -------- CREATE VARIANTS -------- */
        for (let v = 0; v < variantCount; v++) {
          const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
          const price = randomInRange(120, 600);
          const discount = randomInRange(5, 20);
          const discountedPrice = Math.round(
            price - (price * discount) / 100
          );

          const variant = await VarientModel.create({
            ProductName: `${product.name} ${amount}`,
            ProductKeywords: `${product.name}, ${category.name}, grocery, drinks`,

            ProductAmount: amount,
            Parent: parentProduct._id,

            pricing: {
              actualMRP: price,
              discountPercentage: discount,
              discountedPrice
            },

            CategoryId: category.id,
            CategoryName: category.name,
            ParantCategoryId: category.parentId,

            Stock: randomInRange(30, 150),
            rating: randomInRange(3, 5),

            coverImage: product.image,
            images: [product.image],

            Trending: Math.random() > 0.6
          });

          variantIds.push(variant._id);
        }

        /* -------- ATTACH VARIANTS -------- */
        parentProduct.Variants = variantIds;
        await parentProduct.save();

        console.log(
          `✅ ${product.name} created with ${variantIds.length} variants`
        );
      }
    }

    console.log("\n🎉 DRINKS & JUICES SEEDING COMPLETED!");
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.connection.close();
  }
};

/* ================= RUN ================= */
seedProductsAndVariants();
