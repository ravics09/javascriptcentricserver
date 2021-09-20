const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');

mainRoutes.post('/signup', signup);
mainRoutes.post('/signin', signin);
mainRoutes.use('/', (request, response, next)=> {
    response.status(404).json({error:"Page Not Found"});
});

function signup(request, response, next) {
    userServices.createUser(request.body, response, next);
};

function signin(request, response, next) {
    userServices.getUser(request.body, response, next);
};

module.exports = mainRoutes;