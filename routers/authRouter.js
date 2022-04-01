const express = require('express');
const authRoutes = express.Router();
const authServices = require('./../services/authServices');
const { isAuth } = require('./../middleware/isAuth');
const {signInLimiter} = require('./../middleware/rateLimiter');

// Auth Middleware used to validate jwt token for each request.
// authRoutes.use('*', isAuth);
// authRoutes.use(RateLimiter);

authRoutes.post('/signup', signInLimiter, signUp);
authRoutes.post('/signin', signInLimiter, signIn);
authRoutes.post('/forgetpassword', signInLimiter, forgetPassword);
authRoutes.get('/validateresetlink/:id/:token', signInLimiter, validateResetLink); // Validate Reset Password Link Sent On Email Address
authRoutes.put('/resetpassword/:id', signInLimiter, resetPassword);  // Is it secured or not?

function signUp(request, response, next) {
    authServices.signUpUser(request.body, response, next);
};

function signIn(request, response, next) {
    authServices.signInUser(request.body, response, next);
};

function forgetPassword(request, response, next) {
    authServices.forgetPassword(request, response, next);
};

function validateResetLink(request, response, next) {
    authServices.validateResetLink(request, response, next);
};

function resetPassword(request, response, next) {
    authServices.resetPassword(request, response, next);
};

module.exports = authRoutes;