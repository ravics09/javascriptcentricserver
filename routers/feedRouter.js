const express = require('express');
const mainRoutes = express.Router();
const feedService = require('./../services/feedService');
const { isAuth } = require('./../services/authServices');

mainRoutes.post('/createpost', createPost);
mainRoutes.get('/getpost/:id', getPost);
mainRoutes.get('/getposts', getPosts);
mainRoutes.put('/editpost/:id', editPost);
mainRoutes.put('/createnewcomment/:id',createPostComment);

function createPost(request, response, next) {
    feedService.createPost(request, response, next);
};

function getPost(request, response, next) {
    feedService.getPost(request, response, next);
};

function getPosts(request, response, next) {
    feedService.getPosts(request, response, next);
};

function editPost(request, response, next) {
    feedService.editPost(request, response, next);
};

function createPostComment(request, response, next) {
    feedService.createPostComment(request, response, next);
};


module.exports = mainRoutes;