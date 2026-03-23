import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    items: [
      {
        productId: String,
        quantity: Number,
        price: Number,
        title: String,
        image: String,
        unit: String,
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
