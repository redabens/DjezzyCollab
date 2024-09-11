const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// file import
const User = require('../models/users.cjs');
const Path = require('../models/paths.cjs');
const SiteSFTP = require('../models/sitesftp.cjs');

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab').then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));
let checkedSite = null;
// SiteSFTP.findOne({checked:true}).then((res)=>{
//     checkedSite = res;
//     console.log(checkedSite);
//     Path.updateMany({},{serveurSftp:checkedSite._id}).then((res)=>{
//         console.log(res);
//     });
// });
// Path.updateMany({},{serveurSftp:checkedSite._id}).then((res)=>{
//     console.log(res);
// });
