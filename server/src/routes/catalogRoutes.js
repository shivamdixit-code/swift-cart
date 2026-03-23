import { Router } from "express";
import {
  getCategories,
  getProduct,
  getProducts,
  postCategory,
  postProduct,
  putCategory,
  putProduct,
  removeCategory,
  removeProduct,
} from "../controllers/catalogController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", requireAdmin, postCategory);
router.put("/categories/:id", requireAdmin, putCategory);
router.delete("/categories/:id", requireAdmin, removeCategory);

router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", requireAdmin, postProduct);
router.put("/products/:id", requireAdmin, putProduct);
router.delete("/products/:id", requireAdmin, removeProduct);

export default router;
