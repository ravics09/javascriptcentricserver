const db = require("./../database/createConnection");
const Feed = db.Feed;

module.exports = { createPost, getPost, getPosts, editPost };

async function createPost(request, response, next) {
  console.log("request body", request.body);
  const feed = new Feed({
    userId: request.body.userId,
    fullName: request.body.userName,
    postTitle: request.body.postTitle,
    postContent: request.body.postContent
  });
  feed.save().then(() => {
    response.status(200).json({
      message: "You have created a new post",
      statusCode: 200,
    });
  });
}

async function getPost(request, response, next) {
  
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
    response.status(401).send(error);
  });
}

async function editPost(request, response, next) {
  const updatedInfo = new Feed({
    _id: request.params.id,
    postTitle: request.body.postTitle,
    postContent: request.body.postContent
  })

  User.findByIdAndUpdate({ _id: request.params.id}, updatedInfo)
    .then((res) => {
      response.status(200).json({
        message: "Your Post Updated Successfully!",
        user: res,
        statusCode: 200,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}
