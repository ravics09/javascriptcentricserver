const db = require("./../database/createConnection");
const bcrypt = require("bcryptjs");
const User = db.User;

module.exports = { createUser };

async function createUser(userDetails, response, next) {
  User.findOne({
    email: userDetails.email,
  }).then((dbUser) => {
    if (dbUser) {
      return response.status(409).json({ message: "User with this email address already registered, Please signIn..." });
    } else if (userDetails.email && userDetails.password) {
      bcrypt.hash(userDetails.password, 12, (err, passwordHash) => {
        if (err) {
          return response
            .status(500)
            .json({ message: "couldn't hash the password" });
        } else if (passwordHash) {
          return User.create({
            email: userDetails.email,
            fullName: userDetails.fullName,
            hash: passwordHash,
          })
            .then(() => {
              response.status(200).json({ message: "You have signUp successfully. Please signIn here !!" });
            })
            .catch((err) => {
              console.log(err);
              next(err);
              response
                .status(502)
                .json({ message: "Server error while signUp" });
            });
        }
      });
    } else if (!userDetails.password) {
      return response.status(400).json({ message: "Please Enter Password" });
    } else if (!userDetails.email) {
      return response.status(400).json({ message: "Please Enter Email Address" });
    }
  });
}
