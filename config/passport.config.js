const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

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
	console.log(profile);
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
