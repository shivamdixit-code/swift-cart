import { Router } from "express";
import { getUsers } from "../controllers/userController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, getUsers);

export default router;
