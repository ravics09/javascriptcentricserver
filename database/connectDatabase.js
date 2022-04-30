const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = () => {
  const URI = process.env.ATLAS_URL;
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(process.env.MONGODB_URI || URI, connectionParams);
  mongoose.Promise = global.Promise;

  mongoose.connection.on("connected", () => {
    console.log("Connected to database " + URI);
  });
  mongoose.connection.on("error", (err) => {
    console.log("Database connection error " + err);
  });
};

module.exports = connectDatabase;
