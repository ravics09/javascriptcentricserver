const { Schema, model} = require("mongoose");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      trim: true
    },
    mobile: {
      type: Number,
      trim: true,
      minLength: 10,
      maxLength: 10,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: String,
      trim: true,
    },
    work: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
    },
    readingList: [
      {
        postId: String,
      }
    ],
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

userSchema.virtual("Feed", {
  ref: "Feed",
  localField: "_id",
  foreignField: "postedBy",
});

module.exports = model("User", userSchema);
