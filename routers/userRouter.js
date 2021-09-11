const express = require('express');
const mainRoutes = express.Router();
const userServices = require('./../services/userServices');

mainRoutes.post('/signup', signup);

function signup(req, res, next) {
    userServices
        .createUser(req.body)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            next(err);
        });
};

module.exports = mainRoutes;