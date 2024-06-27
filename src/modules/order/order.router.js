import * as orderController from "./controller/order.js";
import { endpoint } from "./order.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { Router } from "express";
const router = Router();

router.post("/", auth(endpoint.create), orderController.createOrder);

router.patch(
  "/:orderId",
  auth(endpoint.cancelOrder),
  orderController.cancelOrder
);

router.patch(
  "/:orderId/admin",
  auth(endpoint.adminUpdateOrder),
  orderController.updateOrderStatusByAdmin
);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   orderController.webhook
// );

export default router;
