import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI ;

// Mock product data(took from gpt)
const mockItems = [
  { name: "Wireless Headphones", price: 1999 },
  { name: "Mechanical Keyboard", price: 3499 },
  { name: "USB-C Charger 65W", price: 1599 },
  { name: "Portable SSD 1TB", price: 6499 },
  { name: "Bluetooth Speaker", price: 2499 },
  { name: "Webcam 1080p", price: 1899 },
  { name: "Gaming Mouse", price: 1499 },
  { name: "HDMI Cable 2m", price: 399 },
  { name: "Laptop Stand", price: 1299 },
  { name: "LED Desk Lamp", price: 999 }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(mockItems);
  console.log("Seeded products:", mockItems.length);
  await mongoose.disconnect();
}
run().catch(e => {
  console.error(e);
  process.exit(1);
});
