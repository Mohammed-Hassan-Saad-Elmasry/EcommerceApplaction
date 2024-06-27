// import subcategoryRouter from '../subcategory/subcategory.router.js'
import * as categoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
import  subcategoryRouter from "../subcategory/subcategory.router.js";
const router = Router({ mergeParams:true,caseSensitive: true });
router.use("/:categoryId/subcategory", subcategoryRouter);

router.get("/", categoryController.getCategory);

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  // validation(validators.createCategory),
  categoryController.createCategory
);

router.put(
  "/:categoryId",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  // validation(validators.updateCategory),
  categoryController.updateCategory
);

export default router;
