const express = require('express');
const mainRoutes = express.Router();
const otherServices = require('./../services/otherServices');

mainRoutes.post('/sendmessage', sendMessage);
mainRoutes.get('/getmessage/:id', getMessage);
mainRoutes.get('/getmessages', getMessages);

function sendMessage(request, response, next) {
    otherServices.sendMessage(request, response, next);
};

function getMessage(request, response, next) {
    otherServices.getMessage(request, response, next);
};

function getMessages(request, response, next) {
    otherServices.getMessages(request, response, next);
};

module.exports = mainRoutes;