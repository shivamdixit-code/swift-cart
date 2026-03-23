import { Router } from "express";
import { addItem, deleteItem, fetchCart, patchItem } from "../controllers/cartController.js";

const router = Router();

router.get("/:sessionId", fetchCart);
router.post("/:sessionId/items", addItem);
router.patch("/:sessionId/items/:productId", patchItem);
router.delete("/:sessionId/items/:productId", deleteItem);

export default router;
