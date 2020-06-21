const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { UserModel } = require("../models/user.model");

const GoogleStrategyOptions = {
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "/auth/google/callback"
};

const GoogleStrategyCallback = async (
	acessToken,
	refreshToken,
	profile,
	done
) => {
	const newUser = {
		googleId: profile.id,
		displayName: profile.displayName,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		image: profile.photos[0].value
	};

	try {
		let user = await UserModel.findOne({ googleId: profile.id });
		if (user) {
			done(null, user);
		} else {
			user = await UserModel.create(newUser);
			done(null, user);
		}
	} catch (err) {
		console.log(err);
	}
};

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(GoogleStrategyOptions, GoogleStrategyCallback)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		UserModel.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
