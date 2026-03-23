import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    items: [
      {
        productId: String,
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    paymentMethod: String,
    status: {
      type: String,
      enum: ["Pending", "Packed", "Delivered"],
      default: "Pending",
    },
    address: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
