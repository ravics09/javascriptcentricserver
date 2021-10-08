const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    console.log("Connected to database " + process.env.MONGODB_URI);
});
mongoose.connection.on('error', err => {
    console.log("Database connection error " + err);
});

module.exports = {
    User: require('../models/userModel'),
    Feed: require('../models/feedModel'),
    Token: require('../models/tokenModel')
};