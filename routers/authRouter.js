const express = require("express");
const authRoutes = express.Router();

const { isAuth } = require("./../middleware/isAuth");
const { signInLimiter } = require("./../middleware/rateLimiter");
const authController = require("./../controllers/authController");

// Auth Middleware used to validate jwt token for each request.
// authRoutes.use('*', isAuth);

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.post("/googlesignin", googleSignIn);
authRoutes.post("/forgetpassword", signInLimiter, forgetPassword);
authRoutes.get(
  "/validateresetlink/:id/:token",
  signInLimiter,
  validateResetLink
);
authRoutes.put("/resetpassword/:id", signInLimiter, resetPassword); // Is it secured or not?

function signUp(request, response) {
  authController.signUpUser(request, response);
}

function signIn(request, response) {
  authController.signInUser(request, response);
}

function googleSignIn(request, response) {
  authController.googleSignInUser(request, response);
}

function forgetPassword(request, response) {
  authController.forgetPassword(request, response);
}

function validateResetLink(request, response) {
  authController.validateResetLink(request, response);
}

function resetPassword(request, response) {
  authController.resetPassword(request, response);
}

module.exports = authRoutes;
