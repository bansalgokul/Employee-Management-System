const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const authRoute = require("./authRoute");
const taskRoute = require("./user/taskRoute");
const projectRoute = require("./user/projectRoute");
const adminTaskRoute = require("./admin/adminTaskRoute");
const adminProjectRoute = require("./admin/adminProjectRoute");
const adminUserRoute = require("./admin/adminUserRoute");

const verifyJWT = require("../middleware/verifyJWT");
const accessCheck = require("../middleware/accessCheck");

router.use("/auth", authRoute);

router.use(verifyJWT);

router.use("/register", registerRoute);
router.use("/task", taskRoute);
router.use("/project", projectRoute);

router.use(accessCheck("admin"));

router.use("/admin/task", adminTaskRoute);
router.use("/admin/project", adminProjectRoute);
router.use("/admin/user", adminUserRoute);

module.exports = router;
