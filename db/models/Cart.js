import mongoose, { Schema, Types, model } from "mongoose";
const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      unique: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {}
);

const cartModel = mongoose.models.cart || model("cart", cartSchema);
export default cartModel;
