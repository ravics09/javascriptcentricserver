const db = require("./../database/createConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;

module.exports = { createUser, getUser };

async function createUser(userDetails, response, next) {
  //Find for email if user already registered or not?
  User.findOne({
    email: userDetails.email,
  }).then((dbUser) => {
    if (dbUser) {
      return response.status(409).json({
        message:
          "User with this email address already registered, Please signIn...",
      });
      //If user not registered then create new user entry in database.
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
              response.status(200).json({
                message: "You have signUp successfully. Please signIn here !!",
              });
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
      return response
        .status(400)
        .json({ message: "Please Enter Email Address" });
    }
  });
}

async function getUser(userDetails, response, next) {
  console.log("getUser called================================");
  // Find for email if user registered or not?
  User.findOne({ email: userDetails.email }).then((dbUser) => {
    if (!dbUser) {
      return response.status(404).json({ message: "User Not Registered." });
    } else {
      // If User Registered then retrive user details and compare password.
      // password hash
      console.log("dbUser=====", dbUser);
      bcrypt.compare(
        userDetails.password,
        dbUser.hash,
        (err, compareRes) => {
          if (err) {
            // error while comparing
            response
              .status(502)
              .json({ message: "Server error while checking user password" });
          } else if (compareRes) {
            // password match
            const token = jwt.sign({ email: userDetails.email }, "secret", {
              expiresIn: "1h",
            });
            console.log("User successfully signin");
            response
              .status(200)
              .json({ message: "User successfully signin", token: token });
          } else {
            // password doesnt match
            response
              .status(401)
              .json({ message: "Invalid Credentials! Please try again." });
          }
        }
      );
    }
  });
}
