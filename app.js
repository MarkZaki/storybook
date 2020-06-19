const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const expressHandlebars = require("express-handlebars");

const { databaseConnection } = require("./config/mongo.config");

// Dotenv Config
dotenv.config({ path: "./config/config.env" });

// Init Port
const PORT = process.env.PORT || 5000;

// Init App
const app = express();

// Database Connection
databaseConnection();

// Setup Morgan For Request Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Set Engine to Handlebars
app.engine(
	".hbs",
	expressHandlebars({ defaultLayout: "main", extname: ".hbs" })
);
app.set("view engine", ".hbs");

// Routes
app.use("/", require("./routes/index.route"));

// Listen To Port
app.listen(PORT, () =>
	console.log(`http://localhost:${PORT}\nMode: ${process.env.NODE_ENV}`)
);
