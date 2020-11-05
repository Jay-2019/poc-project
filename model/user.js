//Models - The schema definition of the Model

const mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
const { schema } = require("./post");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

UserSchema.plugin(timestamps);
module.exports = mongoose.model("User", UserSchema);
