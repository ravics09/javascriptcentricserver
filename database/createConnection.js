const mongoose = require('mongoose');
const URI = process.env.ATLAS_URL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// mongoose.connect(process.env.MONGODB_URI, connectionParams);
mongoose.connect(URI, connectionParams);
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    console.log("Connected to database " + URI);
});
mongoose.connection.on('error', err => {
    console.log("Database connection error " + err);
});

module.exports = {
    User: require('../models/userModel'),
    Feed: require('../models/feedModel'),
    Token: require('../models/tokenModel'),
    ContactUs: require('../models/contactUsModel'),
};