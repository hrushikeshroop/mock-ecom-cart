import { Router } from "express";
import Product from "../models/Product.js";
const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await Product.find().select("_id name price").lean();
  res.json(products.map(p => ({ id: p._id, name: p.name, price: p.price })));
});

export default router;
