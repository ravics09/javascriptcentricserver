const express = require("express");
const app = express();
const multer = require("multer");

const path = require("path");
const cors = require("cors");

// Use Middlewares in our app.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// import routers
app.use("/user", require("./routers/userRouter"));
app.use("/feed", require("./routers/feedRouter"));
app.use("/other", require("./routers/contactUsRouter"));
app.use("/images", (req, res, next)=> {
  var filePath = "./public/uploads/images/music.png";
  var resolvedPath = path.resolve(filePath);
  console.log("resolvedPath", resolvedPath);
  res.sendFile(resolvedPath, 'Base64');
})

//Used Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now())
  }
});

const upload  = multer({storage: storage});

//Create Express web server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 9090;
app.listen(port, () => {
  console.log("JavaScript Centric Server running on port " + port);
});
