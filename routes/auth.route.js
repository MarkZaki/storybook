const router = require("express").Router();
const passport = require("passport");

//@desc: Google Auth
//@route: GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc: Google Auth Callback
//@route: GET /google/callback
router.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

module.exports = router;
