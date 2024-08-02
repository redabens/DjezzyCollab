const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

// file import
const User = require('../models/users.cjs');

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.post('/login/register', async (req,res)=>{
    try{
        const user = User.find({
            email: req.body.email,
            password: req.body.password,
        });
        if(user){
            res.redirect('/');
        }
        else{
            res.redirect('/login');
        }
    }
    catch(error){
        console.log(error.message);
    }
});
app.listen('5173',()=>{
    console.log('Server is running on port 5173...');
});