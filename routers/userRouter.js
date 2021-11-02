const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');
const { isAuth } = require('./../services/authServices');
const Upload  = require('./../middleware/upload');

mainRoutes.post('/signup', signUp);
mainRoutes.post('/signin', signIn);
mainRoutes.get('/profile/:id', isAuth, getProfile);
mainRoutes.put('/editprofile/:id',isAuth, editProfile);
mainRoutes.post('/forgetpassword', forgetPassword);
mainRoutes.get('/validateresetlink/:id/:token', validateResetLink); // Validate Reset Password Link Sent On Email Address
mainRoutes.put('/resetpassword/:id', resetPassword);  // Is it secured or not?
mainRoutes.put('/uploadprofileimage/:id', [isAuth, Upload.single("profilePhoto")], UploadProfileImage);
mainRoutes.put('/addtoreadinglist/:id', isAuth, addToReadingList);
mainRoutes.put('/removefromreadinglist/:id', isAuth, removeFromReadingList);
mainRoutes.get('/fetchReadingList/:id', isAuth, fetchReadingList);

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

function UploadProfileImage(request, response, next) {
    userServices.UploadProfileImage(request, response, next);
};

function addToReadingList(request, response, next) {
    userServices.addToReadingList(request, response, next);
};

function fetchReadingList(request, response, next) {
    userServices.fetchReadingList(request, response, next);
};

function removeFromReadingList(request, response, next) {
    userServices.removeFromReadingList(request, response, next);
};

module.exports = mainRoutes;