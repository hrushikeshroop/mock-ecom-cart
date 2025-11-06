import mongoose from "mongoose";
const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, required: true, min: 1 }
}, {_id: false});

const CartSchema = new mongoose.Schema({
  userKey: { type: String, default: "demo-user", index: true }, // single-cart, no auth
  items: [CartItemSchema]
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
