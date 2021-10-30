const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    comments: [
      {
        text: String,
        postedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type : Date, default: Date.now },
        updated_at: {type: Date, default: Date.now}
      },
      
    ],
    likes: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", feedSchema);
