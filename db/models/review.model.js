import mongoose, { model, Schema, Types } from "mongoose";
const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    max: 5,
    min: 1,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: Types.ObjectId,
    ref: "product",
    required: true,
  },
  orderId: {
    type: Types.ObjectId,
    ref: "order",
    required: true,
  },
});

const reviewModel = mongoose.models.review || model("review", reviewSchema);
export default reviewModel;
