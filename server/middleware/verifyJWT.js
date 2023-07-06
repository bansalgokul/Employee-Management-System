import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(400).json({ error: "Invalid access token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		console.log(decoded);
		const userDoc = await User.findById(decoded.user?._id);
		if (!userDoc) {
			return res.status(400).json({ error: "User not found" });
		}
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(400).json({ error: "Invalid token" });
	}
};

export default verifyJWT;
