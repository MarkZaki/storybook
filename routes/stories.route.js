const router = require("express").Router();

const { ensureAuth } = require("../middleware/auth.middleware");

const { StoryModel } = require("../models/story.model");

//@desc: Add Story Page
//@route: GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
	res.render("stories/add");
});

//@desc: Add Story Page
//@route: POST /stories/add
router.post("/", ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await StoryModel.create(req.body);
		res.redirect("/dashboard");
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

//@desc: Public Stories
//@route: Get /stories
router.get("/", ensureAuth, async (req, res) => {
	try {
		const stories = await StoryModel.find({ status: "public" })
			.populate("user")
			.sort({ createdAt: "desc" })
			.lean();
		console.log(stories);
		res.render("stories/index", { stories });
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
