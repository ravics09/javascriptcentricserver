const db = require("./../database/createConnection");
const config = require("../database/databaseConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;

module.exports = { createUser, getUser, getProfile, editProfile };

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
                message: "You have signed up successfully. Please sign in!!",
                statusCode: 200,
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
  // Find for email if user registered or not?
  User.findOne({ email: userDetails.email }).then((dbUser) => {
    if (!dbUser) {
      return response.status(404).json({ message: "User Not Registered." });
    } else {
      // If User Registered then retrive user details and compare password.
      // password hash
      bcrypt.compare(userDetails.password, dbUser.hash, (err, compareRes) => {
        if (err) {
          // error while comparing
          response
            .status(502)
            .json({ message: "Server error while checking user password" });
        } else if (compareRes) {
          // password match
          const token = jwt.sign(
            { email: userDetails.email },
            config.secretKey,
            {
              expiresIn: config.expiresIn,
            }
          );
          response.status(200).json({
            message: "You have successfully signed in",
            token: token,
            user: dbUser,
            statusCode: 200,
          });
        } else {
          // password doesnt match
          response
            .status(401)
            .json({ message: "Invalid Credentials! Please try again." });
        }
      });
    }
  });
}

async function getProfile(request, response, next) {
  User.findOne({ _id: request.params.id })
    .then((dbUser) => {
      response.status(200).json({
        user: dbUser,
        statusCode: 200,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}

async function editProfile(request, response, next) {
  const updatedInfo = new User({
    _id: request.params.id,
    fullName: request.body.fullName,
    email: request.body.email,
    username: request.body.username,
    mobile: request.body.mobile,
    location: request.body.location,
    bio: request.body.bio,
    skills: request.body.skills,
    work: request.body.work,
    education: request.body.education,
  });

  User.findByIdAndUpdate(request.params.id, updatedInfo)
    .then((dbUser) => {
      response.status(200).json({
        message: "Profile updated successfully!",
        user: dbUser,
        statusCode: 200,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}
