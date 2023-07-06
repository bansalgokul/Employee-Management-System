import { Router } from "express";
const router = Router();
import {
	getAllProject,
	getProject,
} from "../../controllers/user/projectController.js";

router.get("/", getAllProject);
router.get("/:id", getProject);

export default router;
