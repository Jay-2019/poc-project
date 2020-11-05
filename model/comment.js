//Models - The schema definition of the Model

const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
const { schema } = require("./post");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

CommentSchema.plugin(timestamps);
module.exports = mongoose.model("Comment", CommentSchema);
