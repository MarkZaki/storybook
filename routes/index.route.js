const router = require("express").Router();

const { ensureAuth, ensureGuest } = require("../middleware/auth.middleware");

//@desc: Login Page
//@route: GET /
router.get("/", ensureGuest, (req, res) => {
	res.render("login", { layout: "login" });
});

//@desc: Dashboard
//@route: GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
	res.render("dashboard");
});

module.exports = router;
