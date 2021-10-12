require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const db = require("./../database/createConnection");

const BaseURL = "http://localhost:3000";

const User = db.User;
const Token = db.Token;

module.exports = {
  createUser,
  getUser,
  getProfile,
  editProfile,
  forgetPassword,
  validateResetLink,
  resetPassword,
};

async function createUser(request, response, next) {
  const user = await User.findOne({ email: request.email });
  if (!user) {
    if (request.email && request.password) {
      bcrypt.hash(request.password, 12, (err, passwordHash) => {
        if (err) {
          response.status(500).send("Couldn't hash the password");
        } else if (passwordHash) {
          return User.create({
            email: request.email,
            fullName: request.fullName,
            hash: passwordHash,
          }).then(() => {
            response.status(200).json({
              message: "You have signed up successfully. Please sign in!!",
              statusCode: 200,
            });
          });
        }
      });
    } else response.status(400).send("Please Enter Required Details");
  } else
    response.status(409).send("User already registered, Please Sign In...");
}

async function getUser(request, response, next) {
  const user = await User.findOne({ email: request.email });
  if (user) {
    bcrypt.compare(request.password, user.hash, (err, compareRes) => {
      if (err) {
        response.status(502).send("Server error while checking user password");
      } else if (compareRes) {
        const token = jwt.sign(
          { email: request.email },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.EXPIRE_IN,
          }
        );

        response.status(200).json({
          message: "You have successfully signed in",
          token: token,
          user: user,
          userId: user._id.toString(),
          statusCode: 200,
        });
      } else {
        response.status(401).send("Invalid Credentials! Please try again.");
      }
    });
  } else response.status(404).send("User Not Registered.");
}

async function getProfile(request, response, next) {
  const user = await User.findById(request.params.id);
  if (user) {
    response.status(200).json({
      user: user,
      statusCode: 200,
    });
  } else response.status(400).send("User Information Not Found");
}

async function editProfile(request, response, next) {
  const user = User.findById(request.params.id);
  if (user) {
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

    User.findByIdAndUpdate(request.params.id, updatedInfo).then((dbUser) => {
      response.status(200).json({
        message: "Profile updated successfully!",
        user: dbUser,
        statusCode: 200,
      });
    });
  } else response.status(404).send("User Information Not Found.");
}

async function forgetPassword(request, response, next) {
  if (request.body.email === "") {
    response.status(400).send("Email Address Required..");
  }
  const user = await User.findOne({ email: request.body.email });
  if (user) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(20).toString("hex"),
      }).save();

      const resetLink = `${BaseURL}/resetpassword/${user._id}/${token.token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 587,
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
          `${resetLink}` +
          `\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (error, res) => {
        if (error) {
          response.status(500).send("Error While Sending Password Reset Link");
        } else {
          response.status(200).json({
            message: `Recovery email link sent on ${user.email}`,
            statusCode: 200,
          });
        }
      });
    }
  } else response.status(403).send("User Not Found For This Email Address");
}

async function resetPassword(request, response, next) {
  const user = await User.findById(request.params.id);
  if (user) {
    if (request.body.password) {
      bcrypt.hash(request.body.password, 12, (err, passwordHash) => {
        if (err) {
          return response
            .status(500)
            .json({ message: "couldn't hash the password" });
        } else if (passwordHash) {
          user.hash = passwordHash;
          user.save();
          response.status(200).json({
            message: "Password Updated successfully from backend.",
            statusCode: 200,
          });
        }
      });
    }
  } else return response.status(400).send("User doesn't exist.");
}

async function validateResetLink(request, response, next) {
  const user = await User.findById(request.params.id);
  if (user) {
    const token = await Token.findOne({
      userId: user._id,
      token: request.params.token,
    });

    if (token) {
      await user.save();
      await token.delete();
      response.status(200).send("Reset Link Is-Ok");
    } else response.status(400).send("Invalid Link Or Link Expired");
  } else response.status(404).send("User Not Found");
}
