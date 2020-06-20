const router = require("express").Router();
const passport = require("passport");

//@desc: Google Auth
//@route: GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc: Google Auth Callback
//@route: GET /google/callback
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		res.redirect("/dashboard");
	}
);

module.exports = router;
