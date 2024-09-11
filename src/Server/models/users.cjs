const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
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
        type: Array,
        default: [{serveurSFTP:{host: '127.0.0.1',
            port: 22,
            username: 'redabens' ,
            password:'Redabens2004..',
            defaultPath:'/Downloads/public'}
            ,path:'/Downloads/public',
        }],
    },
})

const User = mongoose.model('User',userSchema);

module.exports= User;
