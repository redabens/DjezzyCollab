const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// file import
const User = require('../models/users.cjs');

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab').then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));

// Create a user
const CreateUsers = async ()=>{
const user1 = new User({
    firstName: 'Bensemane',
    lastName: 'Mohamed Reda',
    email: 'reda9bens4@gmail.com',
    password: bcrypt.hashSync('Redabens2004..', 8),
    role: 'admin',
});
const user2 = new User({
    firstName: 'Iratni',
    lastName: 'Amina Sara',
    email: 'ms_iratni@esi.dz',
    password: bcrypt.hashSync('sarair2004', 8),    
});
await user1.save();
await user2.save();
}

