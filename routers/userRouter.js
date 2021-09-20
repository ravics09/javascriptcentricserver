const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');
const authServices = require('./../services/authServices');

mainRoutes.post('/signup', signUp);
mainRoutes.post('/signin', signIn);
mainRoutes.get('/authenticate', isAuthenticate);
mainRoutes.use('/', (request, response, next)=> {
    response.status(404).json({error:"Page Not Found"});
});

function signUp(request, response, next) {
    userServices.createUser(request.body, response, next);
};

function signIn(request, response, next) {
    userServices.getUser(request.body, response, next);
};

function isAuthenticate(request, response, next) {
    authServices.isAuth(request, response, next);
};

module.exports = mainRoutes;