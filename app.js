const express = require("express");
const app = express();
// require('./util/initRadis');
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");


app.get("/test",(req, res) => {
  res.send("Testing success");
})

// Use Middlewares in our app.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());

// import routers
app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/userRouter"));
app.use("/feed", require("./routers/feedRouter"));
app.use("/other", require("./routers/contactUsRouter"));

//Default route for all wrong routes
app.get("*", function(req, res) {
  res.send("App works!!!!!");
})

// app.use("/images", (req, res, next)=> {
//   var filePath = "./public/uploads/images/music.png";
//   var resolvedPath = path.resolve(filePath);
//   console.log("resolvedPath", resolvedPath);
//   res.sendFile(resolvedPath, 'Base64');
// })

//Create Express web server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 9090;
app.listen(port, () => {
  console.log("JavaScript Centric Server running on port " + port);
});
