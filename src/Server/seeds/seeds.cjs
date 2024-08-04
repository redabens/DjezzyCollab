const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// file import
const User = require('../models/users.cjs');

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));