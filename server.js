const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");


// Connect with mongodb atlas
const connectDatabase = require("./database/connectDatabase");
connectDatabase();

// Set PORT Number
const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 9090;

// Use Middlewares in our app.
app.use(cors());
app.use(compression());
app.use(morgan("tiny"));
app.use(helmet.hidePoweredBy());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// import routers
app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/userRouter"));
app.use("/feed", require("./routers/feedRouter"));
app.use("/other", require("./routers/contactUsRouter"));

// app.use("/images", (req, res, next)=> {
//   var filePath = "./public/uploads/images/music.png";
//   var resolvedPath = path.resolve(filePath);
//   console.log("resolvedPath", resolvedPath);
//   res.sendFile(resolvedPath, 'Base64');
// })

// listen server on given port
app.listen(PORT, (err, res) => {
  if (err) {
    console.log(`Error while running server `, err);
  }
  console.log(`JavaScript Centric Server running on ${PORT}`);
});
