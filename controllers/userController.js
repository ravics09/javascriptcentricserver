require("dotenv").config();
const moment = require("moment");
const { createClient } = require("redis");
const User = require("./../models/userModel");

// create and connect redis client to local instance.
const client = createClient();
client.connect();

client.on("connect", () => {
  console.log("connected");
});
client.on("end", () => {
  console.log("disconnected");
});
client.on("reconnecting", () => {
  console.log("reconnecting");
});
client.on("error", (err) => {
  console.log("error", { err });
});

module.exports = {
  getProfile,
  editProfile,
  UploadProfileImage,
  addToReadingList,
  removeFromReadingList,
  fetchReadingList,
};

async function getProfile(request, response) {
  const { id } = request.params;
  const profile = await client.get(id);
  
  if (profile) {
    response.status(200).json({
      user: JSON.parse(profile),
    });
  } else {

    const user = await User.findById(id);
    if (user) {
      const customResponse = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        readingList: user.readingList,
        mobile: user.mobile,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        work: user.work,
        education: user.education,
        profilePhoto: user.profilePhoto,
        createdAt: moment(user.createdAt).format("YYYY-MM-DD"),
        updatedAt: moment(user.updatedAt).format("YYYY-MM-DD"),
      };
      client.setEx(
        id,
        60,
        JSON.stringify({ source: "Redis Cache", ...customResponse })
      );
      response.status(200).json({
        user: customResponse,
      });
    } else response.status(400).send("User Information Not Found");
  }
}

async function editProfile(request, response) {
  const user = User.findById(request.params.id);
  if (user) {
    const updatedInfo = new User({
      _id: request.params.id,
      fullName: request.body.fullName,
      email: request.body.email,
      userName: request.body.userName,
      mobile: request.body.mobile,
      location: request.body.location,
      bio: request.body.bio,
      skills: request.body.skills,
      work: request.body.work,
      education: request.body.education,
    });

    User.findByIdAndUpdate(request.params.id, updatedInfo).then((dbUser) => {
      response.status(200).json({
        message: "Profile updated successfully!",
        user: dbUser,
      });
    });
  } else response.status(404).send("User Information Not Found.");
}

async function UploadProfileImage(request, response) {
  const { id } = request.params;
  var profilePic = request.file.path;
  User.findById(id, (err, data) => {
    data.profilePhoto = profilePic ? profilePic : data.profilePhoto;
    data
      .save()
      .then((doc) => {
        response.status(200).json({
          results: doc,
        });
      })
      .catch((err) => {
        response.json(err);
      });
  });
  // const user = User.findById(id);
  // if (user) {
  //   const updatedInfo = new User({
  //     _id: id,
  //     profilePhoto: request.file.filename,
  //     profilePhotoPath: request.file.path,
  //   });

  //   User.findByIdAndUpdate(id, updatedInfo).then((dbUser) => {
  //     var filePath = dbUser.profilePhotoPath;
  //     var resolvedPath = path.resolve(filePath);
  //     console.log("resolvedPath", resolvedPath);

  //     response.status(200).sendFile(resolvedPath);
  //   });
  // } else response.status(404).send("User Information Not Found.");
}

async function addToReadingList(request, response) {
  const { id } = request.params;
  const { postId } = request.body;

  const user = await User.findById(id);
  if (user) {
    const newItem = {
      postId: postId,
    };

    const updateReadingList = {
      $push: { readingList: newItem },
    };

    User.findByIdAndUpdate(id, updateReadingList).then((res) => {
      response.status(200).json({
        message: "New Article Added To Reading List!",
        readingList: res.readingList,
      });
    });
  }
}

async function removeFromReadingList(request, response) {
  const { id } = request.params;
  const { postId } = request.body;

  const user = await User.findById(id);
  if (user) {
    const newItem = {
      postId: postId,
    };

    const updateReadingList = {
      $push: { readingList: newItem },
    };

    User.findByIdAndUpdate(id, updateReadingList).then((res) => {
      response.status(200).json({
        message: "New Article Added To Reading List!",
        readingList: res.readingList,
      });
    });
  }
}

async function fetchReadingList(request, response) {
  const { id } = request.params;
  const user = await User.findById(id);
  if (user) {
    response.status(200).json({
      readingList: user.readingList,
    });
  } else {
    response.status(404).send("Somthing is wrong.");
  }
}
