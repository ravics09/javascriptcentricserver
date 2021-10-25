const db = require("./../database/createConnection");
const Feed = db.Feed;
const User = db.User;

module.exports = {
  createPost,
  getPost,
  getPosts,
  editPost,
  createPostComment,
  getUserPosts,
  deletePost
};

async function createPost(request, response, next) {
  const feed = new Feed({
    postedBy: request.body.userId,
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
  Feed.findById({ _id: request.params.id })
    .populate("postedBy")
    .populate("comments.postedBy")
    .then((res) => {
      response.status(200).json({
        post: res,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}

async function getPosts(request, response, next) {
  Feed.find({})
    .populate("postedBy")
    .populate("comments.postedBy")
    .exec((error, posts) => {
      if (error) {
        console.log("Retriveing post error", error);
        response.status(401).send(error);
      } else {
        response.status(200).json({
          posts: posts,
          statusCode: 200,
        });
      }
    });
}

async function editPost(request, response, next) {
  const updatedInfo = {
    postTitle: request.body.title,
    postContent: request.body.content,
  };

  Feed.findByIdAndUpdate(request.params.id, updatedInfo)
    .then((res) => {
      response.status(200).json({
        message: "Your Post Updated Successfully!",
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}

async function createPostComment(request, response, next) {
  const feed = Feed.findById(request.params.id);
  if (feed) {
    const newComment = {
      text: request.body.comment,
      postedBy: request.body.userId,
      createdAt: new Date(),
    };

    const updatedFeed = {
      $push: { comments: newComment },
    };

    Feed.findByIdAndUpdate(request.params.id, updatedFeed).then((res) => {
      response.status(200).json({
        message: "Your Comment Added Successfully!",
        comments: res.comments,
      });
    });
  }
}

async function getUserPosts(request, response, next) {
  if (request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const result = await User.findById({ _id: request.params.id }).populate(
      "Feed"
    );

    if (result) {
      response.status(200).json({
        posts: result,
      });
    } else {
      response.status(404).send("Somthing is wrong.");
    }
  } else {
    response.status(404).send("User Id is Not Valid");
  }
}

async function deletePost(request, response, next) {
  Feed.findByIdAndRemove(request.params.id)
  .then((res) => {
    response.status(200).json({
      message: "Your Post Deleted Successfully!",
    });
  })
  .catch((error) => {
    response.status(401).json({
      error: error,
    });
  });
  
}
