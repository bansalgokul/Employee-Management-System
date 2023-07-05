const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");
const express = require("express");
const app = express();
require("dotenv").config();

const indexRoute = require("./routes/indexRoute");
const cookieParser = require("cookie-parser");

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
