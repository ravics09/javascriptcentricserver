const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');
const { isAuth } = require('./../services/authServices');

mainRoutes.post('/signup', signUp);
mainRoutes.post('/signin', signIn);
mainRoutes.get('/profile/:id', isAuth, getProfile);
mainRoutes.put('/editprofile/:id', isAuth, editProfile);

// mainRoutes.get('/authenticate', isAuthenticate);
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


module.exports = mainRoutes;