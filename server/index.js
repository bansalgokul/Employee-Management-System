const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");
const express = require("express");
const app = express();
require("dotenv").config();
const registerRoute = require("./routes/registerRoute");
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/register", registerRoute);

mongoose.connection.once("open", function () {
	console.log("Connected successfully");
});

app.listen(process.env.PORT, () => {
	console.log("Server running on port ", process.env.PORT);
});
