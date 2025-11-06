import { Router } from "express";
import Cart from "../models/Cart.js";
const router = Router();

router.post("/", async (req, res) => {
  const { name, email, cartItems } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const cart = await Cart.findOne({ userKey: "demo-user" }).populate("items.product");
  const items = (cart?.items || []).map(it => ({
    id: it.product._id,
    name: it.product.name,
    price: it.product.price,
    qty: it.qty
  }));
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const receipt = {
    purchaser: { name, email },
    items,
    total,
    currency: "INR",
    timestamp: new Date().toISOString(),
  };
  // Clear the cart after checkout
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json(receipt);
});

export default router;
