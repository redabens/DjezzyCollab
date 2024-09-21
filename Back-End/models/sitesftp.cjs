const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const siteSFTPSchema = new Schema({
    host:{
        type: String,
        required: true,
    },
    port:{
        type: Number,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    defaultPath:{
        type: String,
        required: true,
    },
    checked:{
        type: Boolean,
        default:false,
    },
});
const SiteSFTP = mongoose.model('SiteSFTP',siteSFTPSchema);

module.exports= SiteSFTP;