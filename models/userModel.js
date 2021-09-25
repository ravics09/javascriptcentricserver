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
    username: {
        type: String,
        unique: true,
        trim: true,
        minLength: [4, 'username is too short!'],
        maxLength: 15
    },
    mobile: {
        type: Number,
        unique: true,
        trim: true,
        minLength: 10,
        maxLength: 10
    },
    location: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        unique: true,
        trim: true
    },
    skills: {
        type: String,
        unique: true,
        trim: true
    },
    work: {
        type: String,
        unique: true,
        trim: true
    },
    education: {
        type: String,
        unique: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
},{ timestamps: true });

userSchema.set('toJSON', ()=>{
    virtuals: true;
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
module.exports = mongoose.model('User', userSchema);