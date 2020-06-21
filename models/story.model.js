const { Schema, model } = require("mongoose");

const StorySchema = new Schema({
	title: { type: String, required: true, trim: true },
	body: { type: String, required: true },
	status: { type: String, default: "public", enum: ["public", "private"] },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	likes: { type: Array, default: [] },
	createdAt: { type: Date, default: Date.now }
});

const StoryModel = model("Story", StorySchema);

module.exports = { StoryModel };
