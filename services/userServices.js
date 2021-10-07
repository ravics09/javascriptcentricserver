const db = require("./../database/createConnection");
const config = require("../database/databaseConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;
require("dotenv").config();
// let multer = require("multer");
let nodemailer = require("nodemailer");

module.exports = {
  createUser,
  getUser,
  getProfile,
  editProfile,
  forgetPassword,
};

async function createUser(userDetails, response, next) {
  console.log("createUser called==", userDetails);
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
          console.log("Successfully login");
          response.status(200).json({
            message: "You have successfully signed in",
            token: token,
            user: dbUser,
            userId: dbUser._id.toString(),
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
    userName: request.body.userName,
    mobile: request.body.mobile,
    location: request.body.location,
    bio: request.body.bio,
    skills: request.body.skills,
    work: request.body.work,
    education: request.body.education,
    profileImage: request.body.profileImage,
  });

  // let storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "public");
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, file.fieldname + "-" + Date.now());
  //   },
  // });

  // let upload = multer({ storage: storage }).single('file');

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

async function forgetPassword(request, response, next) {
  if (request.body.email === "") {
    response.status(400).json({
      message: "Email Address Required..",
      statusCode: 400,
    });
  }

  User.findOne({
    email: request.body.email,
  }).then((user) => {
    if (user===null) {
      response.status(403).send({
        message: "This Email not registered with us",
        statusCode: 403
      });
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: "ravisharmacs09@gmail.com",
        to: `${user.email}`,
        subject: "Link To Reset Password",
        text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please lick on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
          `https://localhost:3000/resetpassword` +`\n\n`+
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (error, res) => {
        if (error) {
          console.log("There was an error: ", error);
        } else {
          response.status(200).json({
            message: `Recovery email link sent on ${user.email}`,
            statusCode: 200,
          });
        }
      });
    }
  });
}
