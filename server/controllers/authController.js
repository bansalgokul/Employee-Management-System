const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
	console.log(req);
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Missing Credentials" });
	}

	const foundUser = await User.findOne({ email }).exec();

	if (!foundUser) {
		return res.status(400).json({ error: "User not found" });
	}

	const match = await bcrypt.compare(password, foundUser.password);

	if (!match) {
		res.status(400).json({ error: "Wrong Password" });
	}

	const payload = {
		user: {
			name: foundUser.name,
			roles: foundUser.roles,
			id: foundUser._id,
		},
	};

	console.log(payload);

	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "1d",
	});

	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.status(200).json({
		accessToken,
		message: "Login successful",
		foundUser,
	});
};

const refresh = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.status(400).json({ error: "Cookie missing" });

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err)
				return res
					.status(400)
					.json({ error: "JWT REFERSH TOKEN verify failed" });

			const foundUser = await User.findById(decoded.user.id);
			if (!foundUser)
				return res.status(400).json({ error: "Invalid Refresh Token" });

			const payload = {
				user: {
					name: foundUser.name,
					roles: foundUser.roles,
					id: foundUser._id,
				},
			};

			const accessToken = jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "15m",
				},
			);

			return res.status(200).json({
				accessToken,
				message: "Refresh successful",
			});
		},
	);
};

const logout = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt)
		return res.status(200).json({ message: "Logout successful" });

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.status(200).json({ message: "Cookie cleared" });
};

module.exports = { login, refresh, logout };
