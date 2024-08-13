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

const userRoutes = require("../routes/userRoutes.cjs");
// express configuration
const app = express();

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
// file import
const User = require("../models/users.cjs");

mongoose.connect('mongodb://localhost:27017/Djezzy-Collab').then(() => console.log('Connected to MongoDB...'))
.catch(error => console.log(error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors());
app.use(userRoutes);
app.use("/signUp", cors(), userRoutes);

// sftp configuration
const sftp = new SFTPClient();
const sftpconfig = {
  host: "192.168.0.198",
  port: "22",
  username: "sarair",
  password: "sara2004",
};


async function connectSFTP() {
    try {
        await sftp.connect(sftpconfig);
        console.log('Connected to SFTP server');
    } catch (err) {
        console.log('SFTP connection error:', err);
    }
}

// Connect to SFTP once when the server starts
connectSFTP();

async function disconnectSFTP() {
    try {
        await sftp.end();
        console.log('Disconnected from SFTP server');
    } catch (err) {
        console.log('SFTP disconnection error:', err);
    }
}
// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided');
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(500).send('Failed to authenticate token');
      req.userId = decoded._id;
      next();
    });
  }
// recursive function to verify if name of the file exist and change the name before the upload  
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
// pour connecter les utilisateurs
app.post('/login', async (req,res)=>{
    try{
        const user = await User.findOne({
            email: req.body.email,
        });
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
// pour enregistrer les fichiers dans le serveur
app.post('/upload',[verifyToken,upload.array('files')], async (req,res)=>{
    try{
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
        let restPath = await sftp.cwd();
        console.log(restPath);
        restPath = restPath.slice(1,restPath.length);
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
    }
});
// pour telecharger les fichier
app.get('/download/:filename',verifyToken,async (req,res)=>{
    try{
        const {filename} = req.params;
        // Check if req.userId is set correctly
        // console.log('User ID:', req.userId);
        if (!req.userId) {
            return res.status(401).send('User ID not found');
        }
        const user = await User.findById(req.userId);
        // console.log('User:', user);
        if (!user) {
            return res.status(404).send('User not found');
        }
        let restPath = await sftp.cwd();
        console.log(restPath);
        restPath = restPath.slice(1,restPath.length);
        // console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        // console.log('Directory exists:', dirExists);
        if (!dirExists) return res.status(415).send('Directory not found');
        let downloadDir = path.join(os.homedir(), 'Downloads');
        let dst = fs.createWriteStream(path.join(downloadDir, filename));
        await sftp.get(path.posix.join(userDir, filename), dst);
        res.status(200).send(filename+' was Downloaded successfully check your /Downloads path');
        //   const localTempFilePath = path.join(os.tmpdir(), filename); // Utilisation du répertoire temporaire du système
        //   // Utiliser un flux de lecture pour sftp.get()
        //   const fileData = await sftp.get(path.posix.join(userDir, filename));
        //   fs.writeFile(localTempFilePath, fileData, (err) => {
        //     if (err) {
        //         console.error('Erreur lors de l\'écriture du fichier:', err);
        //         res.status(500).send('Erreur lors du téléchargement du fichier');
        //     } else {
        //         console.log('Téléchargement réussi');
        //         res.download(localTempFilePath, filename, (err) => {
        //             if (err) {
        //                 console.error('Erreur lors de l\'envoi du fichier:', err);
        //                 res.status(500).send('Erreur lors du téléchargement du fichier');
        //             } else {
        //                 console.log('Téléchargement réussi');
        //             }
        //             fs.unlink(localTempFilePath, (unlinkErr) => {
        //                 if (unlinkErr) console.error('Erreur lors de la suppression du fichier temporaire:', unlinkErr);
        //             });
        //         });
        //     }
        // });
    }catch(err){
        console.log('Erreur de requete:'+err);
    }         
});
// pour renommer les fichier
app.patch('/download/:filename',verifyToken,async (req,res)=>{
    try{
        console.log('start renaming');
        const {filename} = req.params;
        console.log(filename);
        const newFilename = req.body.nom;
        console.log('new file name:'+ newFilename);
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
        let restPath = await sftp.cwd();
        console.log(restPath);
        restPath = restPath.slice(1,restPath.length);
        console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        console.log('Directory exists:', dirExists);
        if (!dirExists) return res.status(415).send('Directory not found');
        const lastPath= path.join(userDir,filename);
        console.log(lastPath);
        const newPath = path.join(userDir,newFilename);
        console.log(newPath);
        const renameexists = await sftp.exists(newPath);
        console.dir(renameexists);
        if (renameexists) return res.status(409).send('name already exists choose another one');
        await sftp.rename(lastPath,newPath);
        res.status(200).send('name changed succefully');
    }catch(err){
        console.log(err);
    }         
});

// pour afficher les fichier
app.get('/download',verifyToken,async (req,res)=>{
    try{
        // Check if req.userId is set correctly
        // console.log('User ID:', req.userId);
        if (!req.userId) {
          return res.status(401).send('User ID not found');
        }
        const user = await User.findById(req.userId);
        // console.log('User:', user);
        if (!user) {
            return res.status(404).send('User not found');
        }
        let restPath = await sftp.cwd();
        restPath = restPath.slice(1,restPath.length);
        // console.log(restPath);
        const userDir = path.join(restPath, user.DirPath);
        const dirExists = await sftp.exists(userDir);
        // console.log('Directory exists:', dirExists);
        if (!dirExists) return res.status(415).send('Directory not found');
        const files = await sftp.list(userDir);
        // console.log('Files:', files);
        res.status(200).send({files});
    }catch(err){
        console.log('Erreur de requete'+err);
    }
});
process.on('SIGINT', () => {
    disconnectSFTP().then(() => {
        process.exit();
    });
});

//endpoitn to get the user role
app.get("/userRole", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const userRole = user.role; // Access role from the user object
    res.json({ role: userRole });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).send("Server error");
  }
});

app.listen('3000',()=>{
    console.log('Server is running on port 3000...');
});
