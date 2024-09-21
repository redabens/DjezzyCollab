const mongoose = require('mongoose');
const SiteSftp = require('./sitesftp.cjs');
var Schema = mongoose.Schema;

const pathSchema = new Schema({
    serveurSftp:{
        type:Schema.Types.ObjectId,
        ref:'SiteSftp',
        required:true,
    },
    path: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now,
    },
    createdBy: {
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true, 
    },
})

const Path = mongoose.model('Path',pathSchema);

module.exports = Path;