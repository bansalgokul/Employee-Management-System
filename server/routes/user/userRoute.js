import { Router } from "express";
const router = Router();
import { getUser } from "../../controllers/user/userController.js";

router.route("/").get(getUser);

export default router;
