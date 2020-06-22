const { join } = require("path");

const express = require("express");
const expressHandlebars = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const { config } = require("dotenv");
const morgan = require("morgan");
const mongooseConnection = require("mongoose").connection;
const MongoStore = require("connect-mongo")(session);

const { databaseConnection } = require("./config/mongo.config");

// Dotenv Config
config();

// Passport Config
require("./config/passport.config")(passport);

// Init Port
const PORT = process.env.PORT || 5000;

// Init App
const app = express();

// Init Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
	methodOverride(req => {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

// Database Connection
databaseConnection();

// Setup Morgan For Request Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Handlebars Helpers
const {
	formatDate,
	editIcon,
	select,
	stripTags,
	truncate
} = require("./helpers/hbs.helper");

// Set Engine to Handlebars
const handlebarsOption = {
	defaultLayout: "main",
	extname: ".hbs",
	helpers: { formatDate, editIcon, select, stripTags, truncate }
};
app.engine(".hbs", expressHandlebars(handlebarsOption));
app.set("view engine", ".hbs");

// Sessions
app.use(
	session({
		secret: "keyboard storybook",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection })
	})
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variables
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// Set Public Folder
app.use(express.static(join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/stories", require("./routes/stories.route"));

// Listen To Port
app.listen(PORT, () =>
	console.log(`http://localhost:${PORT}\nMode: ${process.env.NODE_ENV}`)
);
