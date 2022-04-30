const express = require('express');
const mainRoutes = express.Router();
const feedController = require('./../controllers/feedController');

mainRoutes.post('/createpost', createPost);
mainRoutes.get('/getpost/:id', getPost);
mainRoutes.get('/getposts', getPosts);
mainRoutes.put('/editpost/:id', editPost);
mainRoutes.put('/createnewcomment/:id',createPostComment);
mainRoutes.get('/getuserposts/:id', getUserPosts);
mainRoutes.delete('/deletepost/:id', deletePost);


function createPost(request, response, next) {
    feedController.createPost(request, response, next);
};

function getPost(request, response, next) {
    feedController.getPost(request, response, next);
};

function getPosts(request, response, next) {
    feedController.getPosts(request, response, next);
};

function editPost(request, response, next) {
    feedController.editPost(request, response, next);
};

function createPostComment(request, response, next) {
    feedController.createPostComment(request, response, next);
};

function getUserPosts(request, response, next) {
    feedController.getUserPosts(request, response, next);
};

function deletePost(request, response, next) {
    feedController.deletePost(request, response, next);
};


module.exports = mainRoutes;