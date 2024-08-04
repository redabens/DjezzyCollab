const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const secret = 'Abdelhak_kaid_El_Hadj_Andjechairi'; // Change to a strong secret
const path = require('path');
const os = require('os');
const cors = require('cors');
const fs = require('fs');
const SFTPClient = require('ssh2-sftp-client');

// express configuration
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

// sftp configuration
const sftp = new SFTPClient();
const sftpconfig = {
    host: '192.168.1.65',
    port: '22',
    username: 'redabens',
    password: 'Redabens2004..',
}


app.post('/login', async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email,
        });
        console.log(user);
        if(!user) return res.status(404).send('user not found');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(401).send('the password is incorrect');
        const token = jwt.sign({ _id: user._id }, secret,{expiresIn:86400});
        res.status(200).send({token});
    }
    catch(error){
        res.status(500).send('Erro logging in');
    }
});
// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided');
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(500).send('Failed to authenticate token');
      req.userId = decoded._id;
      console.log(req.userId);
      next();
    });
  }
async function verifyExistance(file,userDir,remotePath,i){
    try{
        let fichier = file;
        const filExists = await sftp.exists(remotePath);
        if(!filExists) return await sftp.put(fichier.buffer, remotePath);
        else {
            const indexDot = fichier.originalname.lastIndexOf('.');
            if(fichier.originalname[indexDot-3]=== '(' && fichier.originalname[indexDot-1]=== ')' && fichier.originalname[indexDot-2]=== `${i-1}`){
                fichier.originalname= fichier.originalname.slice(0,indexDot-3)+`(${i})`+fichier.originalname.slice(indexDot,fichier.originalname.length);
            }else{
                fichier.originalname = fichier.originalname.slice(0,indexDot)+`(${i})`+fichier.originalname.slice(indexDot,fichier.originalname.length);
            }
            const newRemotePath = path.posix.join(userDir, file.originalname);
            console.log('Remote path:', newRemotePath);
            await verifyExistance(file,userDir,newRemotePath,i+1);
        }
    }catch(err){
        console.log(err);
    }
}
app.post('/upload',[verifyToken,upload.array('files')], async (req,res)=>{
    try{
        let restPath = '';
        await sftp.connect(sftpconfig).then(res=>{
            console.log('connected');
            return sftp.cwd();
        }).then(p=>{
            restPath = p;
            console.log('Current dir:',p);
        });
        // Check if req.userId is set correctly
        console.log('User ID:', req.userId);
        if (!req.userId) {
          return res.status(401).send('User ID not found');
        }
        const user = await User.findById(req.userId);
        console.log('User:', user);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Upload files to SFTP server
        restPath = restPath.slice(1,restPath.length);
        console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        console.log('Directory exists:', dirExists);
        if (!dirExists) await sftp.mkdir(userDir, true);
        for (let i = 0; i < req.files.length; i++) {
            let j=1;
            let file = req.files[i];
            console.log(file);
            const remotePath = path.posix.join(userDir, file.originalname);
            console.log('Remote path:', remotePath);
            await verifyExistance(file,userDir,remotePath,j);
        }
        res.status(200).send('Upload successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    } finally {
      await sftp.end();
    }
});
app.get('/download/:filename',verifyToken,async (req,res)=>{
    try{
        const {filename} = req.params;
        let restPath = '';
        await sftp.connect(sftpconfig).then(res=>{
            console.log('connected');
            return sftp.cwd();
        }).then(p=>{
            restPath = p;
            console.log('Current dir:',p);
        });
        // Check if req.userId is set correctly
        console.log('User ID:', req.userId);
        if (!req.userId) {
          return res.status(401).send('User ID not found');
        }
        const user = await User.findById(req.userId);
        console.log('User:', user);
        if (!user) {
            return res.status(404).send('User not found');
        }
        restPath = restPath.slice(1,restPath.length);
        console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        console.log('Directory exists:', dirExists);
        if (!dirExists) return res.status(415).send('Directory not found');
        const filePath = path.join(userDir, filename);
        const tempFilePath = path.join(os.tmpdir(), filename);

        await sftp.get(filePath, tempFilePath);
        console.log(`Downloaded file to temp path: ${tempFilePath}`);

        // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    res.download(tempFilePath, filename, (err) => {
        if (err) {
          console.error('Error sending the file:', err);
          res.status(500).send('Failed to download file');
        } else {
          console.log('File sent successfully');
        }
  
        // Delete the temporary file after sending it
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        });
      });
    }catch(err){

    }finally{
        await sftp.end();
    }            
});
app.get('/download',verifyToken,async (req,res)=>{
    try{
        let restPath = '';
        await sftp.connect(sftpconfig).then(res=>{
            console.log('connected');
            return sftp.cwd();
        }).then(p=>{
            restPath = p;
            console.log('Current dir:',p);
        });
        // Check if req.userId is set correctly
        console.log('User ID:', req.userId);
        if (!req.userId) {
          return res.status(401).send('User ID not found');
        }
        const user = await User.findById(req.userId);
        console.log('User:', user);
        if (!user) {
            return res.status(404).send('User not found');
        }
        restPath = restPath.slice(1,restPath.length);
        console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        console.log('Directory exists:', dirExists);
        if (!dirExists) return res.status(415).send('Directory not found');
        const files = await sftp.list(userDir);
        console.log('Files:', files);
        res.status(200).send({files});
    }catch(err){

    }finally{
        await sftp.end();
    }
})
app.listen('3000',()=>{
    console.log('Server is running on port 3000...');
});