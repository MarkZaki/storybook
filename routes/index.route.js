const router = require("express").Router();

const { ensureAuth, ensureGuest } = require("../middleware/auth.middleware");

const { StoryModel } = require("../models/story.model");

//@desc: Login Page
//@route: GET /
router.get("/", ensureGuest, (req, res) => {
	res.render("login", { layout: "login" });
});

//@desc: Dashboard
//@route: GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
	try {
		const stories = await StoryModel.find({ user: req.user.id })
			.sort({ createdAt: "desc" })
			.lean();
		res.render("dashboard", {
			name: req.user.displayName,
			image: req.user.image,
			stories
		});
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
