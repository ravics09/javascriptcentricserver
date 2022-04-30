const express = require('express');
const mainRoutes = express.Router();
const otherController = require('./../controllers/otherController');

mainRoutes.post('/sendmessage', sendMessage);
mainRoutes.get('/getmessage/:id', getMessage);
mainRoutes.get('/getmessages', getMessages);

function sendMessage(request, response, next) {
    otherController.sendMessage(request, response, next);
};

function getMessage(request, response, next) {
    otherController.getMessage(request, response, next);
};

function getMessages(request, response, next) {
    otherController.getMessages(request, response, next);
};

module.exports = mainRoutes;