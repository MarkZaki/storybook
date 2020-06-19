const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const { databaseConnection } = require("./config/mongo.config");

// Dotenv Config
dotenv.config({ path: "./config/config.env" });

// Init Port
const PORT = process.env.PORT || 5000;

// Database Connection
databaseConnection();

// Init App
const app = express();

// Setup Morgan For Request Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Listen To Port
app.listen(PORT, () =>
	console.log(`http://localhost:${PORT}\nMode: ${process.env.NODE_ENV}`)
);
