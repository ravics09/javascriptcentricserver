const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    postTitle: {
      type: String,
      trim: true,
      minLength: [10, "title is too short!"],
      maxLength: 50,
    },
    postContent: {
      type: String,
      trim: true,
      minLength: [4, "postContent is too short!"],
      maxLength: 1500,
    },
    topicCover: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

feedSchema.set("toJSON", {
  virtuals: true
});
module.exports = mongoose.model("Feed", feedSchema);
