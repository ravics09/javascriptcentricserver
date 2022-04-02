// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const { Schema, model} = require("mongoose");

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  { timestamps: true }
);

tokenSchema.set("toJSON", {
  virtuals: true,
});

module.exports = model("token", tokenSchema);
