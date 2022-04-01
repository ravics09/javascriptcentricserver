require("dotenv").config();
const db = require("./../database/createConnection");
const User = db.User;

module.exports = {
  getProfile,
  editProfile,
  UploadProfileImage,
  addToReadingList,
  removeFromReadingList,
  fetchReadingList,
};

async function getProfile(request, response, next) {
  const { id } = request.params;
  const user = await User.findById(id);
  if (user) {
    response.status(200).json({
      user: user,
    });
  } else response.status(400).send("User Information Not Found");
}

async function editProfile(request, response, next) {
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

async function UploadProfileImage(request, response, next) {
  const { id } = request.params;
  var profilePic = request.file.path;
  User.findById(id, (err, data)=>{
    data.profilePhoto = profilePic ? profilePic : data.profilePhoto;
    data.save().then(doc=>{
      response.status(200).json({
        results: doc
      })
    })
    .catch(err=>{
      response.json(err);
    })
  })
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
      $push: {readingList: newItem}
    }

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
      $push: {readingList: newItem}
    }

    User.findByIdAndUpdate(id, updateReadingList).then((res) => {
      response.status(200).json({
        message: "New Article Added To Reading List!",
        readingList: res.readingList,
      });
    });
  }
}

async function fetchReadingList(request, response){
  const { id } = request.params;
  const user  = await User.findById(id);
  if (user) {
    response.status(200).json({
      readingList: user.readingList
    });
  } else {
    response.status(404).send("Somthing is wrong.");
  }
}