// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const { Schema, model} = require("mongoose");

const contactUsSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "subject is too short!"],
      maxLength: 50,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    }
  },
  { timestamps: true }
);

contactUsSchema.set("toJSON", {
  virtuals: true,
});
module.exports = model("ContactUs", contactUsSchema);
