import * as authcontroller from "./controller/auth.js";
import { Router } from "express";
const router = Router();
router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.Login);
router.patch("/sendcode", authcontroller.sendCode);
router.patch("/forgetpassword", authcontroller.forgetpassword);
export default router;
