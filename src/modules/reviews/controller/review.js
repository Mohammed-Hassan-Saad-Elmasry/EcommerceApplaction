import orderModel from "../../../../db/models/Order.js";
import reviewModel from "../../../../db/models/review.model.js";
import { asyncHandler } from "../../../utils/errorhandling.js";

export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;

  const order = await orderModel.findOne({
    userId: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order) {
    return next(
      new Error("can not review product befor receive it", { cause: 400 })
    );
  }
  const review = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (review) {
    return next(new Error("already reviewed by you ", { cause: 400 }));
  }

  const newreview = await reviewModel.create({
    comment,
    rating,
    createdBy: req.user._id,
    orderId: order._id,
    productId,
  });
  return res.status(201).json({ message: "done", newreview });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId, productId } = req.params;

  await reviewModel.updateOne(
    {
      _id: reviewId,
      productId,
    },
    req.body
  );

  return res.status(200).json({ message: "done" });
});
