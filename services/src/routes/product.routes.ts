import { Router } from "express";

import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getCategorySummary,
  getPriceDistribution,
  getTopRatedProducts,
  getProductsByCursor,
} from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

const router = Router();

router.post("/", validate(createProductSchema),createProduct);

router.get("/", getProducts);
router.get(
  "/cursor",
  getProductsByCursor
);
router.get("/:id", getProduct);

router.patch("/:id", validate(updateProductSchema), updateProduct);

router.delete("/:id", deleteProduct);

router.get(
  "/analytics/category-summary",
  getCategorySummary
);

router.get(
  "/analytics/price-distribution",
  getPriceDistribution
);

router.get(
  "/analytics/top-rated",
  getTopRatedProducts
);


export default router;


