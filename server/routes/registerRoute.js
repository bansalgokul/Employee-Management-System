import { Router } from "express";
const router = Router();
import { newUser } from "../controllers/registerController.js";

// /register
router.post("/", newUser);

export default router;
