import { Router } from "express";
import { getOrders, patchOrderStatus, postOrder } from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, getOrders);
router.post("/", postOrder);
router.patch("/:id/status", requireAdmin, patchOrderStatus);

export default router;
