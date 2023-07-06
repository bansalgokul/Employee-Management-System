import { Router } from "express";
const router = Router();
import { login, logout, refresh } from "../controllers/authController.js";

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
