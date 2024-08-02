const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    DirPath:{
        type: String,
        default: '/Uploads/public',
    },
})

const User = mongoose.model('User',userSchema);

module.exports= User;
