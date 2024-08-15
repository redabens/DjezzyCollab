const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const pathSchema = new Schema({
    path: {
        type:String,
        required:true,
        unique:true,
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