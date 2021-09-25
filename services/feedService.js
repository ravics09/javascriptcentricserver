const db = require("./../database/createConnection");
const config = require("../database/databaseConfig");
const Feed = db.Feed;

module.exports = { createPost, getPost, getPosts };

async function createPost(request, response, next) {
  
  const feed = new Feed({
    userId: request.body.userId,
    fullName: request.body.fullName,
    postTitle: request.body.postTitle,
    postContent: request.body.postContent,
  });
  feed.save().then(() => {
    response.status(200).json({
      message: "You have created a new post",
      statusCode: 200,
    });
  });
}

async function getPost(request, response, next) {
  console.log("createPost called with request", request);
  
  Feed.findById({ _id: request.params.id })
    .then((res) => {
      response.status(200).json({
        post: res,
        statusCode: 200,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}

async function getPosts(request, response, next) {
  Feed.find()
  .then((res) => {
    response.status(200).json({
      posts: res,
      statusCode: 200,
    });
  })
  .catch((error) => {
    response.status(401).json({
      error: error,
    });
  });
}

// async function editPost(request, response, next) {


//   // User.findByIdAndUpdate(request.params.id, updatedInfo)
//   //   .then((dbUser) => {
//   //     response.status(200).json({
//   //       message: "Profile updated successfully!",
//   //       user: dbUser,
//   //       statusCode: 200,
//   //     });
//   //   })
//   //   .catch((error) => {
//   //     response.status(401).json({
//   //       error: error,
//   //     });
//   //   });
// }
