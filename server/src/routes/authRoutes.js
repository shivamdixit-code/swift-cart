import { Router } from "express";
import { adminLogin, me, requestOtp, verifyOtpController } from "../controllers/authController.js";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpController);
router.post("/admin/login", adminLogin);
router.get("/me", me);

export default router;
