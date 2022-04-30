const User = require("./../models/userModel");
const Feed = require("./../models/feedModel");

async function createPost(request, response) {
  const { userId, postTitle, postContent } = request.body;
  const feed = new Feed({
    postedBy: userId,
    postTitle: postTitle,
    postContent: postContent,
  });

  feed.save().then(() => {
    response.status(200).json({
      message: "Your Post Submitted Successfully",
    });
  });
}

async function getPost(request, response) {
  const { id } = request.params;
  Feed.findById({ _id: id })
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

async function getPosts(request, response) {
  Feed.find({}).select(["postedBy", "postTitle", "likeCount", "commentCount","createdAt"])
    .populate("postedBy", ["fullName","email" ,"profilePhoto"])
    .exec((error, posts) => {
      if (error) {
        response.status(401).send(error);
      } else {
        response.status(200).json({
          posts: posts,
          statusCode: 200,
        });
      }
    });
}

async function editPost(request, response) {
  const { title, content } = request.body;
  const updatedInfo = {
    postTitle: title,
    postContent: content,
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

async function createPostComment(request, response) {
  const { comment, userId } = request.body;
  const { id } = request.params;

  const feed = Feed.findById(id);
  if (feed) {
    const newComment = {
      text: comment,
      postedBy: userId,
      createdAt: new Date(),
    };

    const updatedFeed = {
      $push: { comments: newComment },
    };

    Feed.findByIdAndUpdate(id, updatedFeed).then((res) => {
      response.status(200).json({
        message: "Your Comment Added Successfully!",
        comments: res.comments,
      });
    });
  }
}

async function getUserPosts(request, response) {
  const { id } = request.params;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const result = await User.findById({ _id: id }).populate("Feed");

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

async function deletePost(request, response) {
  const { id } = request.params;
  Feed.findByIdAndRemove(id)
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

module.exports = {
  createPost,
  getPost,
  getPosts,
  editPost,
  createPostComment,
  getUserPosts,
  deletePost,
};
