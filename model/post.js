//Models - The schema definition of the Model

const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

PostSchema.plugin(timestamps);
module.exports = mongoose.model("Post", PostSchema);
