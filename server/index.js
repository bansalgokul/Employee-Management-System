import mongoose from "mongoose";
import connectDB from "./config/dbConfig.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import indexRoute from "./routes/indexRoute.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const corsConfig = {
	origin: true,
	credentials: true,
};
app.use(cors(corsConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRoute);

mongoose.connection.once("open", function () {
	console.log("Connected successfully");
});

app.listen(process.env.PORT, () => {
	connectDB();
	console.log("Server running on port ", process.env.PORT);
});
