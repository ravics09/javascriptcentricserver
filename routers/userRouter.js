const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');
const { isAuth } = require('./../services/authServices');

mainRoutes.post('/signup', signUp);
mainRoutes.post('/signin', signIn);
mainRoutes.get('/profile/:id', isAuth, getProfile);
mainRoutes.put('/editprofile/:id', isAuth, editProfile);
mainRoutes.post('/forgetpassword', forgetPassword);
mainRoutes.get('/validateresetlink/:id/:token', validateResetLink); // Validate Reset Password Link Sent On Email Address
mainRoutes.put('/resetpassword/:id', resetPassword);

mainRoutes.use('/', (request, response, next)=> {
    response.status(404).json({error:"Page Not Found"});
});

function signUp(request, response, next) {
    userServices.createUser(request.body, response, next);
};

function signIn(request, response, next) {
    userServices.getUser(request.body, response, next);
};

function getProfile(request, response, next) {
    userServices.getProfile(request, response, next);
};

function editProfile(request, response, next) {
    userServices.editProfile(request, response, next);
};

function forgetPassword(request, response, next) {
    userServices.forgetPassword(request, response, next);
};

function validateResetLink(request, response, next) {
    userServices.validateResetLink(request, response, next);
};

function resetPassword(request, response, next) {
    userServices.resetPassword(request, response, next);
};

module.exports = mainRoutes;