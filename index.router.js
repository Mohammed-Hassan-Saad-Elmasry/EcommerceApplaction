import connectDB from "./db/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import branRouter from "./src/modules/brand/brand.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import productRouter from "./src/modules/product/product.router.js";
import reviewsRouter from "./src/modules/reviews/review.router.js";
import { handelerror , asyncHandler } from "./src/utils/errorhandling.js";
// import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import userRouter from "./src/modules/user/user.router.js";
import cors from "cors";
const initApp = (app, express) => {
  app.use(cors()); // allow access from anyWare
  app.use(express.json());
  app.get("/", (req, res, next) => {
    return res
      .status(200)
      .json({ message: "Welcome to E-commerce APP C39  online" });
  });
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);
  app.use(`/product`, productRouter);
  app.use(`/category`, categoryRouter);
  // app.use(`/subCategory`, subcategoryRouter);
  app.use(`/review`, reviewsRouter);
  app.use(`/coupon`, couponRouter);
  app.use(`/cart`, cartRouter);
  app.use(`/order`, orderRouter);
  app.use(`/brand`, branRouter);
  app.all("*", (req, res, next) => {
    res.status(404).send("In-valid Routing Plz check url or method");
  });
  app.use(asyncHandler)
  app.use(handelerror);
  connectDB();
};
export default initApp;
