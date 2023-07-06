import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
	try {
		await connect(process.env.MONGO_URI);
	} catch (er) {
		console.log("error", er);
	}
};

export default connectDB;
