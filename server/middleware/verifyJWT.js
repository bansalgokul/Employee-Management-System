const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader.startsWith("Bearer ")) {
		return res.status(400).json({ error: "Invalid access token" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.status(400).json({ error: "Token decoding error" });
		}

		console.log(decoded);
		req.user = decoded.user;
		next();
	});
};

module.exports = verifyJWT;
