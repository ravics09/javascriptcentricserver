const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      unique: true,
      trim: true,
      minLength: [4, "username is too short!"],
      maxLength: 15,
    },
    mobile: {
      type: Number,
      unique: true,
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
    profileImage: {
      data: Buffer,
      contentType: String,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: {virtuals: true} }
);

// userSchema.set("toJSON", {
//   virtuals: true,
// });

userSchema.virtual("Feed",{
  ref: "Feed",
  localField: "_id",
  foreignField: "postedBy"
})

module.exports = mongoose.model("User", userSchema);
