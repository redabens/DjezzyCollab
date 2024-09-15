const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const secret = "Abdelhak_kaid_El_Hadj_Andjechairi"; // Change to a strong secret
const path = require("path");
const os = require("os");
const cors = require("cors");
const fs = require("fs");
const userRoutes = require("../routes/userRoutes.cjs");
const notifRoutes = require("../routes/notifRoutes.cjs");
const sitesftpRoutes = require("../routes/sitesftpRoutes.cjs");
const notifController = require("./notifController.cjs");
const { verifyToken, verifyExistance } = require("./functions.cjs");
const {
  sftp,
  buildFileTree,
  connectSFTP,
  disconnectSFTP,
} = require("./sitesftpController.cjs");

const { authenticate, addUser } = require("./ldap.cjs"); // Importez le module LDAP
// express configuration
const app = express();

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
// file import
const User = require("../models/users.cjs");
const Path = require("../models/paths.cjs");
const Notif = require("../models/notifs.cjs");
const Sitesftp = require("../models/sitesftp.cjs");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Djezzy-Collab")
  .then(async () => {
    console.log("Connected to MongoDB...");
    // Connect to SFTP once when the server starts
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite) return console.log("No site sftp checked");
    const sftpConfig = {
      host: checkedSite.host,
      port: checkedSite.port,
      username: checkedSite.username,
      password: checkedSite.password,
    };
    await connectSFTP(sftpConfig);
  })
  .catch((error) => console.log(error.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/users", userRoutes);
app.use("/notifs", notifRoutes);
app.use("/sitesftp", sitesftpRoutes);

// pour connecter les utilisateurs
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const credentials = await authenticate(email, password);
    console.log(credentials);

    if (credentials) {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) return res.status(404).send("user not found");
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(401).send("the password is incorrect");

      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 });
      return res.status(200).send({ token });
    } else {
      return res.status(401).send({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error logging in" });
  }
});

// recuperer les paths de la database
app.get("/creation-compte", async (req, res) => {
  try {
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
    const paths = await Path.find({ serveurSftp: checkedSite._id });
    if (!paths) return res.status(404).send("no path found");
    res.status(200).send({ paths, checkedSite });
  } catch {
    console.log("erreur de requete");
    res.status(500).send("serveur error");
  }
});
// creation de l'utilisateur
app.post("/creation-compte", async (req, res) => {
  try {
    const TabSite = await Sitesftp.find({});
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
    let DirPath = TabSite.map((item) => {
      return {
        serveurSFTP: {
          host: item.host,
          port: item.port,
          username: item.username,
          password: item.password,
          defaultPath: item.defaultPath,
        },
        path: item.defaultPath,
      };
    });
    // Trouver l'index de l'objet correspondant dans DirPath
    const index = DirPath.findIndex(
      (dir) =>
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
    );
    if (index === -1) {
      return res.status(404).send({ error: "No matching path found" });
    }
    // Accéder et modifier l'objet à cet index
    console.log(req.body.userData.userPath);
    DirPath[index].path = req.body.userData.userPath;
    console.log("DirPath:", DirPath);
    // creer l'utilisateur
    const utilisateur = {
      firstName: req.body.userData.firstName,
      lastName: req.body.userData.lastName,
      email: req.body.userData.email,
      password: bcrypt.hashSync(req.body.userData.password, 8),
      DirPath: DirPath,
      role: req.body.userData.role,
    };
    const newUser = new User(utilisateur);
    const saved = await newUser.save();
    console.log("saved:", saved);

    if (!saved) return res.status(404).send("Failed to add user");

    addUser(utilisateur, (success, err) => {
      if (success) {
        return res.status(200).send("User added successfully");
      } else {
        console.error("Error adding user to LDAP:", err);
        return res
          .status(401)
          .send("Error adding user to LDAP: " + err.message);
      }
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).send("Error adding user");
  }
});

//endpoint to get the user role
app.get("/user", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(409).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = await user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    res.status(200).send({ user, checkedSite, userPath });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ error: "Server error" });
  }
});
// pour enregistrer les fichiers dans le serveur
app.post("/upload", [verifyToken, upload.array("files")], async (req, res) => {
  try {
    console.log("User ID:", req.userId);
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    console.log("User:", user);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(409).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    console.log("User path:", userPath);
    // Upload files to SFTP server
    let restPath = await sftp.cwd();
    console.log(restPath);
    restPath = restPath.slice(1, restPath.length);
    const userDir = path.join(restPath, userPath);
    const dirExists = await sftp.exists(userDir);
    console.log("Directory exists:", dirExists);
    if (!dirExists) await sftp.mkdir(userDir, true);
    for (let i = 0; i < req.files.length; i++) {
      let j = 1;
      let file = req.files[i];
      console.log(file);
      const remotePath = path.posix.join(userDir, file.originalname);
      console.log("Remote path:", remotePath);
      await verifyExistance(file, userDir, remotePath, j);

      // creation de la notification of upload
      const notifData = {
        userId: req.userId,
        type: "upload",
        path: userPath,
        fileName: file.originalname,
      };
      await notifController.addNotif({
        body: notifData,
      });
    }

    res.status(200).send("Upload successful");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

//download files
app.get("/download/:filename", verifyToken, async (req, res) => {
  try {
    const { filename } = req.params;
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(409).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    console.log("User path:", userPath);
    // recuper le path de base puis lui ajouter le path restant du user
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1);
    const userDir = path.join(restPath, userPath);
    const dirExists = await sftp.exists(userDir);
    if (!dirExists)
      return res.status(415).send({ error: "Directory not found" });
    // sends the stream directly to the browser
    const filePath = path.posix.join(userDir, filename);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    sftp.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).send({ error: "Failed to download file" });
  }
});

// pour renommer les fichier
app.patch("/download/:filename", verifyToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const newFilename = req.body.nom;
    if (filename === newFilename) {
      return res.status(200).send("Name not changed");
    }
    // Check if req.userId is set correctly
    console.log("User ID:", req.userId);
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(400).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    console.log("User path:", userPath);
    // recuper le path de base puis lui ajouter le path restant du user
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1, restPath.length);
    const userDir = path.join(restPath, userPath);
    const dirExists = await sftp.exists(userDir);
    if (!dirExists)
      return res.status(415).send({ error: "Directory not found" });
    const lastPath = path.join(userDir, filename);
    console.log(lastPath);
    const newPath = path.join(userDir, newFilename);
    console.log(newPath);
    const renameexists = await sftp.exists(newPath);
    console.dir(renameexists);
    if (renameexists)
      return res
        .status(409)
        .send({ error: "name already exists choose another one" });
    await sftp.rename(lastPath, newPath);
    res.status(200).send("name changed succefully");
  } catch (err) {
    console.log(err);
  }
});
//delete file from sftp
app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const filename = req.params.id;
    console.log(filename);
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(400).send({ error: "No SFTP site checked" });

    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;

    // Construct the full path to the file to be deleted
    let restPath = await sftp.cwd();

    restPath = restPath.slice(1, restPath.length);
    console.log("1", restPath);

    const userDir = path.join(restPath, userPath);
    console.log("2", userDir);

    const filePath = path.join(userDir, filename);
    console.log("3", filePath);

    const fileExists = await sftp.exists(filePath);
    if (!fileExists) return res.status(404).send({ error: "File not found" });
    await sftp.delete(filePath);
    res.status(200).send({ message: `File ${filename} deleted successfully. `});
  } catch (err) {
    console.log("Error deleting file:", err);
    res
      .status(500)
      .send({ error: "Failed to delete file due to a server error." });
  }
});

// pour afficher les fichier
app.get("/download", verifyToken, async (req, res) => {
  try {
    // Check if req.userId is set correctly
    // console.log('User ID:', req.userId);
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    // console.log('User:', user);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(400).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    console.log("User path:", userPath);
    // recuper le path de base puis lui ajouter le path restant du user
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1, restPath.length);
    // console.log(restPath);
    const userDir = path.join(restPath, userPath);
    const dirExists = await sftp.exists(userDir);
    // console.log('Directory exists:', dirExists);
    if (!dirExists)
      return res.status(415).send({ error: "Directory not found" });
    const files = await sftp.list(userDir);
    // console.log('Files:', files);
    res.status(200).send({ files });
  } catch (err) {
    console.log("Erreur de requete" + err);
  }
});

//delete file from sftp
app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const filename = req.params.id;
    console.log(filename);
    if (!req.userId) {
      return res.status(401).send({ error: "User ID not found" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(400).send({ error: "No SFTP site checked" });

    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;

    // Construct the full path to the file to be deleted
    let restPath = await sftp.cwd();

    restPath = restPath.slice(1, restPath.length);
    console.log("1", restPath);

    const userDir = path.join(restPath, userPath);
    console.log("2", userDir);

    const filePath = path.join(userDir, filename);
    console.log("3", filePath);

    const fileExists = await sftp.exists(filePath);
    if (!fileExists) return res.status(404).send({ error: "File not found" });
    await sftp.delete(filePath);
    res.status(200).send({ message: `File ${filename} deleted successfully.` });
  } catch (err) {
    console.log("Error deleting file:", err);
    res
      .status(500)
      .send({ error: "Failed to delete file due to a server error." });
  }
});

// definition d'un repertoire existant dans le serveur comme un repertoire de depot sftp
app.post("/paths/create", verifyToken, async (req, res) => {
  const { pathName } = req.body;
  console.log("Path:", pathName);
  try {
    // Check if the user ID is valid
    console.log("User ID: ==>", req.userId);
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    // Find the user by ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Format the full path
    const fullPath = pathName;
    console.log("Full path:", fullPath);
    const existingPath = await Path.findOne({ path: fullPath });
    if (existingPath) {
      console.log("Path already exists in the database:", fullPath);
      return res.status(400).json({ message: "Path already exists" });
    }
    // Create the directory on the SFTP server (if necessary)
    // Uncomment and implement the SFTP logic if needed
    // const directoryExists = await sftp.exists(fullPath);
    // if (!directoryExists) {
    //   await sftp.mkdir(fullPath, true);
    //   console.log(`Directory created: ${fullPath}`);
    // } else {
    //   return res.status(400).json({ message: "Directory already exists" });
    // }
    //get checked serveur sftp
    const checkedSite = await Sitesftp.findOne({ checked: true });
    if (!checkedSite)
      return res.status(409).send({ error: "No site sftp checked" });
    const newPath = new Path({
      serveurSftp: checkedSite._id,
      path: fullPath,
      createdBy: req.userId,
    });
    await newPath.save();

    console.log("Path saved in MongoDB:", newPath);
    res
      .status(201)
      .json({ message: "Directory created and path saved", path: newPath });
  } catch (error) {
    console.error("Error creating path:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// recuperer toute l'arborescense des repertoires et fichiers du serveur sftp
app.get("/tree-files", async (req, res) => {
  try {
    const fileTree = await buildFileTree("");
    if (!fileTree)
      return res
        .status(404)
        .send({ error: "failed to build the tree of repositories!" });
    res.status(200).json(fileTree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

app.listen("3000", () => {
  console.log("Server is running on port 3000...");
});
