import { Router } from "express";
const router = Router();
import { login, logout, refresh } from "../controllers/authController.js";

router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", refresh);

export default router;
