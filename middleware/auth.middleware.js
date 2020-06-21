const ensureAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect("/");
	}
};

const ensureGuest = (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect("/dashboard");
	} else {
		return next();
	}
};

module.exports = { ensureAuth, ensureGuest };
