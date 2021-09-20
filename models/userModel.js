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
},{ timestamps: true });

userSchema.set('toJSON', ()=>{
    virtuals: true;
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});
module.exports = mongoose.model('User', userSchema);