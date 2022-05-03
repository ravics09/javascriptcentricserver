const express = require("express");
const mainRoutes = express.Router();

const Upload = require("./../middleware/upload");
const { isAuth } = require("./../middleware/isAuth");
const { apiLimiter } = require("./../middleware/rateLimiter");
const userController = require("./../controllers/userController");


// Middleware that is specific to this route
mainRoutes.use("*", isAuth);
mainRoutes.use(apiLimiter);

mainRoutes.get("/profile/:id", getProfile);
mainRoutes.put("/editprofile/:id", editProfile);
mainRoutes.put(
  "/uploadprofileimage/:id",
  // [isAuth, Upload.single("profilePhoto")],
  Upload.single("profilePhoto"),
  UploadProfileImage
);
mainRoutes.put("/addtoreadinglist/:id", addToReadingList);
mainRoutes.put("/removefromreadinglist/:id", removeFromReadingList);
mainRoutes.get("/fetchReadingList/:id", fetchReadingList);

function getProfile(request, response, next) {
  userController.getProfile(request, response, next);
}

function editProfile(request, response, next) {
  userController.editProfile(request, response, next);
}

function UploadProfileImage(request, response, next) {
  userController.UploadProfileImage(request, response, next);
}

function addToReadingList(request, response, next) {
  userController.addToReadingList(request, response, next);
}

function fetchReadingList(request, response, next) {
  userController.fetchReadingList(request, response, next);
}

function removeFromReadingList(request, response, next) {
  userController.removeFromReadingList(request, response, next);
}

module.exports = mainRoutes;
