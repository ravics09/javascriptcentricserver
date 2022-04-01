const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');
const { isAuth } = require('./../middleware/isAuth');
const Upload  = require('./../middleware/upload');

// Middleware that is specific to this route
mainRoutes.use('*', isAuth);

mainRoutes.get('/profile/:id',  getProfile);
mainRoutes.put('/editprofile/:id', editProfile); 
mainRoutes.put('/uploadprofileimage/:id', [isAuth, Upload.single("profilePhoto")], UploadProfileImage);
mainRoutes.put('/addtoreadinglist/:id', isAuth, addToReadingList);
mainRoutes.put('/removefromreadinglist/:id', isAuth, removeFromReadingList);
mainRoutes.get('/fetchReadingList/:id', isAuth, fetchReadingList);

function getProfile(request, response, next) {
    userServices.getProfile(request, response, next);
};

function editProfile(request, response, next) {
    userServices.editProfile(request, response, next);
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