import * as cartController from "./controller/cart.js";
import { endPoint } from "./cart.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from "express";
const router = Router();
router.post("/", auth(endPoint.create), cartController.createCart);
router.patch("/remove", auth(endPoint.create), cartController.deleteItems);
router.patch(
  "/clear",
  auth(endPoint.create),
  cartController.clearCartController
);
export default router;
