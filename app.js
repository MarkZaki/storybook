const { join } = require("path");

const express = require("express");
const expressHandlebars = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const { config } = require("dotenv");
const morgan = require("morgan");

const { databaseConnection } = require("./config/mongo.config");

// Dotenv Config
config();

// Passport Config
require("./config/passport.config")(passport);

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

// Sessions
app.use(
	session({
		secret: "keyboard storybook",
		resave: false,
		saveUninitialized: false
	})
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Set Public Folder
app.use(express.static(join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));

// Listen To Port
app.listen(PORT, () =>
	console.log(`http://localhost:${PORT}\nMode: ${process.env.NODE_ENV}`)
);
