require('dotenv').config(); // Charger les variables d'environnement depuis .env
const jwt = require("jsonwebtoken");
const path = require("path");
const {sftp} = require("./sitesftpController.cjs");
// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("No token provided");
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(500).send("Failed to authenticate token");
      req.userId = decoded._id;
      next();
    });
  }

  // recursive function to verify if name of the file exist and change the name before the upload
async function verifyExistance(file, userDir, remotePath, i) {
    try {
      let fichier = file;
      const filExists = await sftp.exists(remotePath);
      if (!filExists) return await sftp.put(fichier.buffer, remotePath);
      else {
        const indexDot = fichier.originalname.lastIndexOf(".");
        if (
          fichier.originalname[indexDot - 3] === "(" &&
          fichier.originalname[indexDot - 1] === ")" &&
          fichier.originalname[indexDot - 2] === `${i - 1}`
        ) {
          fichier.originalname =
            fichier.originalname.slice(0, indexDot - 3) +
            `(${i})` +
            fichier.originalname.slice(indexDot, fichier.originalname.length);
        } else {
          fichier.originalname =
            fichier.originalname.slice(0, indexDot) +
            `(${i})` +
            fichier.originalname.slice(indexDot, fichier.originalname.length);
        }
        const newRemotePath = path.posix.join(userDir, file.originalname);
        console.log("Remote path:", newRemotePath);
        await verifyExistance(file, userDir, newRemotePath, i + 1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {verifyToken,verifyExistance};