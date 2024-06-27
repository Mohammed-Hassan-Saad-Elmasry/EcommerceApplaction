import { auth } from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as productcontroller from "./controller/product.js";
import reviews from "../reviews/review.router.js";
import { endpoint } from "./product.endPoint.js";
fileUpload;
import { Router } from "express";
const router = Router();
router.use("/:productId/review", reviews);
router.post(
  "/",
  auth(endpoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  productcontroller.createProduct
);

router.get("/", productcontroller.productList);
router.patch(
  "/:productId/wishlist",
  auth(endpoint.productList),
  productcontroller.addToWishList
);

router.delete(
  "/:productId/wishlist",
  auth(endpoint.productList),
  productcontroller.removeToWishList
);
export default router;
