const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');

mainRoutes.post('/signup', signUp);
mainRoutes.post('/signin', signIn);
mainRoutes.use('/', (request, response, next)=> {
    response.status(404).json({error:"Page Not Found"});
});

function signUp(request, response, next) {
    userServices.createUser(request.body, response, next);
};

function signIn(request, response, next) {
    userServices.getUser(request.body, response, next);
};

module.exports = mainRoutes;