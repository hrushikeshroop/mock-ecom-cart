import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
const router = Router();

function computeTotal(populatedCart) {
  return (populatedCart.items || []).reduce((sum, it) => {
    const price = it.product?.price ?? 0;
    return sum + price * it.qty;
  }, 0);
}

async function getOrCreateCart() {
  let cart = await Cart.findOne({ userKey: "demo-user" });
  if (!cart) {
    cart = await Cart.create({ userKey: "demo-user", items: [] });
  }
  return cart;
}


router.get("/", async (req, res) => {
  const cart = await getOrCreateCart();
  await cart.populate("items.product");
  const total = computeTotal(cart);
  res.json({
    items: cart.items.map(it => ({
      id: it.product._id,
      name: it.product.name,
      price: it.product.price,
      qty: it.qty
    })),
    total
  });
});


router.post("/", async (req, res) => {
  const { productId, qty = 1 } = req.body || {};
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const cart = await getOrCreateCart();
  const idx = cart.items.findIndex(it => it.product.toString() === productId);
  if (idx >= 0) {
    cart.items[idx].qty += qty;
  } else {
    cart.items.push({ product: product._id, qty });
  }
  await cart.save();
  await cart.populate("items.product");
  const total = computeTotal(cart);
  res.status(201).json({
    message: "Added to cart",
    cart: {
      items: cart.items.map(it => ({
        id: it.product._id,
        name: it.product.name,
        price: it.product.price,
        qty: it.qty
      })),
      total
    }
  });
});


router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  const cart = await getOrCreateCart();
  cart.items = cart.items.filter(it => it.product.toString() != productId);
  await cart.save();
  await cart.populate("items.product");
  const total = computeTotal(cart);
  res.json({
    message: "Removed from cart",
    items: cart.items.map(it => ({
      id: it.product._id,
      name: it.product.name,
      price: it.product.price,
      qty: it.qty
    })),
    total
  });
});


router.patch("/:id", async (req, res) => {
  const productId = req.params.id;
  const { qty } = req.body || {};
  if (typeof qty !== "number" || qty < 1) {
    return res.status(400).json({ error: "qty must be >= 1" });
  }
  const cart = await getOrCreateCart();
  const idx = cart.items.findIndex(it => it.product.toString() === productId);
  if (idx === -1) return res.status(404).json({ error: "Item not in cart" });
  cart.items[idx].qty = qty;
  await cart.save();
  await cart.populate("items.product");
  const total = computeTotal(cart);
  res.json({
    message: "Updated quantity",
    items: cart.items.map(it => ({
      id: it.product._id,
      name: it.product.name,
      price: it.product.price,
      qty: it.qty
    })),
    total
  });
});

export default router;
