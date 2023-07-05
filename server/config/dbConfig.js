const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
	} catch (er) {
		console.log("error", er);
	}
};

module.exports = connectDB;
