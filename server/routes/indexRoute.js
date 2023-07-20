import { Router } from "express";
const router = Router();

import authRoute from "./authRoute.js";
import userRoute from "./user/userRoute.js";
import taskRoute from "./user/taskRoute.js";
import projectRoute from "./user/projectRoute.js";
import adminTaskRoute from "./admin/adminTaskRoute.js";
import adminProjectRoute from "./admin/adminProjectRoute.js";
import adminUserRoute from "./admin/adminUserRoute.js";

import verifyJWT from "../middleware/verifyJWT.js";
import accessCheck from "../middleware/accessCheck.js";

router.use("/auth", authRoute);

router.use(verifyJWT);

router.use("/user", userRoute);
router.use("/task", taskRoute);
router.use("/project", projectRoute);

router.use(accessCheck("admin"));

router.use("/admin/task", adminTaskRoute);
router.use("/admin/project", adminProjectRoute);
router.use("/admin/user", adminUserRoute);

export default router;
