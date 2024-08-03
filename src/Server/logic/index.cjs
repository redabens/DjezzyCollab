const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

// file import
const User = require('../models/users.cjs');

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/login', async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email,
        });
        console.log(user);
        if(user){
            if(user.password === req.body.password){
                res.send('success');
            }
            else{
                res.send('the password is incorrect');    
            }
        }
        else{
            res.send('The user is not Registred');
        }
    }
    catch(error){
        console.log(error.message);
    }
});
app.post('/upload',upload.array('files'), async (req,res)=>{
    try{
        console.dir(req.files);
    }
    catch(error){
        console.log(error.message);
    }
})
app.listen('3000',()=>{
    console.log('Server is running on port 3000...');
});