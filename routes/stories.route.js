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

//@desc: Edit Story Page
//@route: GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
	const story = await StoryModel.findOne({
		_id: req.params.id
	}).lean();

	if (!story) {
		return res.render("error/404");
	}

	if (story.user != req.user.id) {
		res.redirect("/stories");
	} else {
		res.render("stories/edit", { story });
	}
});

// @desc    Update story
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
	try {
		let story = await StoryModel.findById(req.params.id).lean();

		if (!story) {
			return res.render("error/404");
		}

		if (story.user != req.user.id) {
			res.redirect("/stories");
		} else {
			story = await StoryModel.findOneAndUpdate(
				{ _id: req.params.id },
				req.body,
				{
					new: true,
					runValidators: true
				}
			);

			res.redirect("/dashboard");
		}
	} catch (err) {
		console.error(err);
		return res.render("error/500");
	}
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
	try {
		let story = await StoryModel.findById(req.params.id).lean();

		if (!story) {
			return res.render("error/404");
		}

		if (story.user != req.user.id) {
			res.redirect("/stories");
		} else {
			await StoryModel.remove({ _id: req.params.id });
			res.redirect("/dashboard");
		}
	} catch (err) {
		console.error(err);
		return res.render("error/500");
	}
});

// @desc    Show single story
// @route   GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
	try {
		let story = await StoryModel.findById(req.params.id)
			.populate("user")
			.lean();

		if (!story) {
			return res.render("error/404");
		}

		res.render("stories/show", {
			story
		});
	} catch (err) {
		console.error(err);
		res.render("error/404");
	}
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
	try {
		const stories = await StoryModel.find({
			user: req.params.userId,
			status: "public"
		})
			.populate("user")
			.sort({ createdAt: "desc" })
			.lean();

		res.render("stories/index", {
			stories
		});
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
