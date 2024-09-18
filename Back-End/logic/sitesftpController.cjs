const mongoose = require("mongoose");
const SFTPClient = require("ssh2-sftp-client");
const siteSFTP = require("../models/sitesftp.cjs");
const User = require("../models/users.cjs");
const Path = require("../models/paths.cjs");
const path = require("path");
// sftp configuration
const sftp = new SFTPClient();

async function connectSFTP(sftpConfig) {
  try {
    await sftp.connect(sftpConfig);
    console.log("Connected to SFTP server");
  } catch (err) {
    console.log("SFTP connection error:", err);
  }
}

async function disconnectSFTP() {
  try {
    await sftp.end();
    console.log("Disconnected from SFTP server");
  } catch (err) {
    console.log("SFTP disconnection error:", err);
  }
}

// pour l'affichage de l'arbore
async function canReadPath(path) {
  try {
    const files = await sftp.list(path);
    console.log("Dossier listé avec succès:", files);
    return true;
  } catch (err) {
    if (err.code === 5) {
      // Vérifie le code d'erreur
      console.error("Permission refusée pour lire ce chemin:", path);
    } else {
      console.error("Erreur lors de l'accès au chemin:", err.message);
    }
    return false;
  }
}

const buildFileTree = async (dirPath) => {
  try {
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1, restPath.length);
    const Path = path.join(restPath, dirPath);
    const access = await canReadPath(Path);
    if (access) {
      const items = await sftp.list(Path);
      const tree = [];

      for (let item of items) {
        if (item.type === "d") {
          let children = await buildFileTree(`${dirPath}/${item.name}`);
          tree.push({
            id: `${dirPath}/${item.name}`,
            label: item.name,
            type: "d",
            children,
          });
        } else {
          tree.push({
            id: `${dirPath}/${item.name}`,
            label: item.name,
            type: "f",
          });
        }
      }
      return tree;
    } else {
      return null; // for uneccessible directories
    }
  } catch (err) {
    // Skip directories that can't be accessed due to permission issues
    console.error(`Skipped directory ${dirPath} due to error:`, err.message);
    return null;
  }
};

const getSiteSFTP = async (req, res) => {
  try {
    const sites = await siteSFTP.find({});
    if (!sites) return res.status(404).send({ error: "No site SFTP found" });
    res.status(200).send(sites);
  } catch (err) {
    res.status(500).send({ error: "Error getting site SFTP" + err });
  }
};

const addSiteSFTP = async (req,res)=>{
    try{
      const {sftpconfig,defaultPath} = req.body;
      const sitesftp = {...sftpconfig,defaultPath:defaultPath};
      const site = new siteSFTP(sitesftp);
      const Ssaved = await site.save();
      if(!Ssaved) return res.status(404).send({error:"Failed to add site SFTP"});
      const path = new Path({
        serveurSftp: Ssaved._id,
        path: Ssaved.defaultPath,
        createdBy: req.userId,
      })
      const Psaved = await path.save();
      if(!Psaved) return res.status(409).send({error:"Failed to add path"});
      const users = await User.updateMany(
        {},
        {
          $push: {
            DirPath: {
              $each: [
                {
                  serveurSFTP: {
                    ...sftpconfig,
                    port:parseInt(sftpconfig.port),
                    defaultPath: site.defaultPath,
                  },
                  path: site.defaultPath
                }
              ]
            }
          }
        }
      );
      if(!users) return res.status(409).send({error:"Failed to update users"});
      res.status(200).send("site SFTP added");
    }catch(err){
        console.log(err);      
        res.status(500).send({error:"Error adding site SFTP"+err});
    }
}

const editSiteSftp = async (req,res)=>{
    try{
        const nouveauId = req.params.id;
        const {ancienId} = req.body;
        const ancien = await siteSFTP.findByIdAndUpdate(ancienId,{checked:false});
        if(!ancien) return res.status(404).send({error:"Failed to update ancien site SFTP"});
        const nouveau = await siteSFTP.findByIdAndUpdate(nouveauId,{checked:true});
        if(!nouveau) return res.status(409).send({error:"Failed to update nouveau site SFTP"});
        await disconnectSFTP();
        const sftpConfig = {
          host: nouveau.host,
          port: nouveau.port,
          username: nouveau.username,
          password: nouveau.password,
        }
        await connectSFTP(sftpConfig);
        res.status(200).send({error:"site SFTP updated"});
    }catch(err){
        res.status(500).send({error:"Error updating site SFTP"+err});
    }
}

const visualiseSiteSFTP = async (req,res)=>{
    try{
        const sftpConfig = req.body;
        await disconnectSFTP();
        await connectSFTP(sftpConfig);
        const fileTree = await buildFileTree("");
        if(!fileTree) return res.status(404).send({error: "failed to build the tree of repositories!"})
        res.status(200).json(fileTree);
    }catch(err){
        res.status(500).send({error:"Error visualising site SFTP"+err});
    }finally{
      await disconnectSFTP();
      // Connect to SFTP once when the server starts
      const checkedSite = await siteSFTP.findOne({ checked: true });
      if (!checkedSite) return console.log("No site sftp checked");
      const sftpConfig = {
        host: checkedSite.host,
        port: checkedSite.port,
        username: checkedSite.username,
        password: checkedSite.password,
      };
      await connectSFTP(sftpConfig);
    }
}
process.on("SIGINT", () => {
  disconnectSFTP().then(() => {
    process.exit();
  });
});
module.exports = {
  connectSFTP,
  disconnectSFTP,
  getSiteSFTP,
  editSiteSftp,
  addSiteSFTP,
  visualiseSiteSFTP,
  buildFileTree,
  sftp,
};
