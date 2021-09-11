const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
});
userSchema.set('toJSON', {
    virtuals: true
});
module.exports = mongoose.model('User', userSchema);