const mongoose = require("mongoose");

const databaseConnection = async () => {
	try {
		// TODO: Don't forget to put your connection string here or in the .env file
		const connection = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		console.log(`Database Connected, Host: ${connection.connection.host}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = { databaseConnection };
