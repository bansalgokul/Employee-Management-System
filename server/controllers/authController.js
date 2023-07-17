import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const schema = Joi.object({
			email: Joi.string()
				.email()
				.required()
				.messages({ "string.email": "Invalid Email" }),
			password: Joi.string()
				.min(6)
				.required()
				.messages({ "string.min": "Password too short. Min 6 char" }),
		});

		const validation = schema.validate({
			email,
			password,
		});
		if (validation.error) {
			return res
				.status(401)
				.json({ error: validation.error.details[0].message });
		}

		const foundUser = await User.findOne({ email })
			.select("+password")
			.exec();

		if (!foundUser) {
			return res.status(404).json({ error: "User not found" });
		}

		const match = await bcrypt.compare(password, foundUser.password);

		if (!match) {
			return res.status(401).json({ error: "Wrong Password" });
		}

		const payload = {
			user: {
				name: foundUser.name,
				roles: foundUser.roles,
				_id: foundUser._id,
			},
		};

		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "150m",
		});
		const refreshToken = jwt.sign(
			payload,
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: "1d",
			},
		);

		const userDoc = await User.findOne({ email });

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			accessToken,
			message: "Login successful",
			userDoc,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Login error" });
	}
};

const refresh = (req, res) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.jwt)
			return res.status(400).json({ error: "Cookie missing" });

		const refreshToken = cookies.jwt;

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err)
					return res
						.status(400)
						.json({ error: "Invalid credentials" });

				const foundUser = await User.findById(decoded.user._id);
				if (!foundUser)
					return res
						.status(400)
						.json({ error: "Invalid credentials" });

				const payload = {
					user: {
						name: foundUser.name,
						roles: foundUser.roles,
						_id: foundUser._id,
					},
				};

				const accessToken = jwt.sign(
					payload,
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: "150m",
					},
				);

				return res.status(200).json({
					accessToken,
					message: "Refresh successful",
				});
			},
		);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot refresh" });
	}
};

const logout = (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies?.jwt)
			return res.status(204).json({ message: "Logout successful" });

		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});
		return res.status(200).json({ message: "Cookie cleared" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot logout" });
	}
};

export { login, refresh, logout };
