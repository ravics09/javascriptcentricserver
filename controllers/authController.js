require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const BaseURL = "http://localhost:3000";

const User = require("./../models/userModel");
const Token = require("./../models/tokenModel");

async function signUpUser(request, response) {
  console.log("User details for sign up",request.body);
  const { email, fullName, password } = request.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    if (email && password) {
      bcrypt.hash(password, 12, async (err, passwordHash) => {
        if (err) {
          response.status(500).send("Couldn't hash the password");
        } else if (passwordHash) {
          return User.create({
            email: email,
            fullName: fullName,
            hash: passwordHash,
          }).then(() => {
            response.status(200).json({
              message: "You have signed up successfully. Please sign in!!"
            });
          });
        }
      });
    } else response.status(400).send("Please Enter Required Details");
  } else
    response.status(409).send("User already registered, Please Sign In...");
}

async function signInUser(request, response) {
  console.log("sign user data", request.body);
  const { email, password } = request.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    response.status(404).json({
      message: "User Not Exist.",
      status: 404,
    });
  } else {
    const customResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      readingList: user.readingList,
      mobile: user.mobile,
      location: user.location,
      bio: user.bio,
      skills: user.skills,
      work: user.work,
      education: user.education,
      profilePhoto: user.profilePhoto,
    };
    bcrypt.compare(password, user.hash, (err, compareRes) => {
      if (err) {
        response
          .status(502)
          .json({ message: "Server error while checking user password" });
      } else if (compareRes) {
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
          expiresIn: process.env.EXPIRE_IN,
        });
        response.status(200).json({
          accessToken: token,
          user: customResponse,
        });
      } else {
        response.status(401).json({
          message: "Invalid Credentials! Please try again.",
        });
      }
    });
  }
}

async function googleSignInUser(request, response) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { idToken } = request.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((res) => {
      const { email_verified, name, email } = res.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const { _id, email, fullName } = user;

            const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
              expiresIn: process.env.EXPIRE_IN,
            });

            return response.status(200).json({
              accessToken: token,
              user: { _id, email, fullName },
            });
          } else {
            const password = email + process.env.SECRET_KEY;

            bcrypt.hash(password, 12, async (err, passwordHash) => {
              if (err) {
                response.status(500).send("Couldn't hash the password");
              } else if (passwordHash) {
                return User.create({
                  email: email,
                  fullName: name,
                  hash: passwordHash,
                }).then((data) => {
                  const { _id, email, fullName } = data;
                  const token = jwt.sign(
                    { email: email },
                    process.env.SECRET_KEY,
                    { expiresIn: process.env.EXPIRE_IN }
                  );

                  response.status(200).json({
                    accessToken: token,
                    user: { _id, email, fullName },
                  });
                });
              }
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
}

async function forgetPassword(request, response) {
  const { email } = request.body;

  if (email === "") {
    response.status(400).send("Email Address Required..");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    response.status(403).send("User Not Registered With This Email");
  } else {
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
            message: `Recovery email link sent on ${user.email}`
          });
        }
      });
    }
  }
}

async function resetPassword(request, response) {
  const { password } = request.body;
  const { id } = request.params;

  const user = await User.findById(id);
  if (!user) {
    response.status(400).send("User doesn't exist.");
  } else if (password) {
    bcrypt.hash(password, 12, (err, passwordHash) => {
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
}

async function validateResetLink(request, response) {
  const { id, token } = request.params;

  const user = await User.findById(id);
  if (user) {
    const tok = await Token.findOne({
      userId: user._id,
      token: token,
    });

    if (tok) {
      await user.save();
      await tok.delete();
      response.status(200).send("Reset Link Is-Ok");
    } else response.status(400).send("Invalid Link Or Link Expired");
  } else response.status(404).send("User Not Found");
}

module.exports = {
  signInUser,
  googleSignInUser,
  signUpUser,
  forgetPassword,
  resetPassword,
  validateResetLink,
};
