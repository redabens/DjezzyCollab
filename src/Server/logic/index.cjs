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
const SFTPClient = require("ssh2-sftp-client");
const userRoutes = require("../routes/userRoutes.cjs");

const { authenticate, addUser } = require("./ldap.cjs"); // Importez le module LDAP
// express configuration
const app = express();

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
// file import
const User = require("../models/users.cjs");
const Path = require("../models/paths.cjs");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Djezzy-Collab")
  .then(() => console.log("Connected to MongoDB..."))
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

// sftp configuration
const sftp = new SFTPClient();
// sftp.on("debug", (msg) => {
//   console.log("DEBUG: " + msg);
// });
const sftpconfig = {
  host: "172.25.80.1",
  port: "22",
  username: "sarair",
  password: "sara2004",
  // debug: console.log,
};

// const sftpconfig = {
//   host: "192.168.157.12",
//   port: "22",
//   username: "redabens",
//   password: "Redabens2004..",
// };

// connect to ldap server
const connectToLdap = () => {
  return new Promise((resolve, reject) => {
    client.bind(
      "cn=admin,dc=djezzy-collab,dc=com",
      "your-admin-password",
      (err) => {
        if (err) {
          reject("Failed to connect to LDAP server: " + err);
        } else {
          console.log("Connected to LDAP server");
          resolve();
        }
      }
    );
  });
};

async function connectSFTP() {
  try {
    await sftp.connect(sftpconfig);
    console.log("Connected to SFTP server");
  } catch (err) {
    console.log("SFTP connection error:", err);
  }
}

// Connect to SFTP once when the server starts
connectSFTP();

async function disconnectSFTP() {
  try {
    await sftp.end();
    console.log("Disconnected from SFTP server");
  } catch (err) {
    console.log("SFTP disconnection error:", err);
  }
}
// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token provided");

  jwt.verify(token, secret, (err, decoded) => {
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
// pour connecter les utilisateurs
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      const credentials = authenticate(email,password);
      if (credentials) {
        const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) return res.status(404).send("user not found");
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 });
      res.status(200).send({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    // const user = await User.findOne({
    //   email: req.body.email,
    // });
    // if (!user) return res.status(404).send("user not found");
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    // if (!validPassword)
    //   return res.status(401).send("the password is incorrect");
    // const token = jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 });
    // res.status(200).send({ token });
  } catch (error) {
    res.status(500).send("Erro logging in");
  }
});
// recuperer les paths de la database
app.get("/creation-compte", async (req, res) => {
  try {
    const paths = await Path.find({});
    if (!paths) return res.status(404).send("no path found");
    res.status(200).send({ paths });
  } catch {
    console.log("erreur de requete");
    res.status(500).send("serveur error");
  }
});

app.post("/creation-compte", async (req, res) => {
  try {
    const utilisateur = {
      firstName: req.body.userData.firstName,
      lastName: req.body.userData.lastName,
      email: req.body.userData.email,
      password: bcrypt.hashSync(req.body.userData.password, 8),
      DirPath: req.body.userData.DirPath,
      role: req.body.userData.role,
    }
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
    }
  );


  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).send("Error adding user");
  }
});

// const utilisateur1 = {
//   firstName: 'Iratni',
//   lastName: 'Sara Amina',
//   email: 'ms_iratni@esi.dz',
//   password: bcrypt.hashSync('sara2004', 8),
//   DirPath: '/Downloads/public',  
//   role: 'user',  
// };
// const utilisateur2 = {
//   firstName: 'Bensemane',
//   lastName: 'Mohamed Reda',
//   email: 'reda9bens4@gmail.com',
//   password: bcrypt.hashSync('Redabens2004..', 8),
//   DirPath: '/Downloads/public',  
//   role: 'admin',  
// };
// const createManualUser = async (utilisateur) => {
//   try {
    

//     // Save the user in MongoDB
//     const newUser = new User(utilisateur);
//     const savedUser = await newUser.save();
//     console.log('User created successfully in MongoDB:', savedUser);

//     // Create the user in LDAP
//     addUser(utilisateur, (success, err) => {
//       if (success) {
//         console.log('User created successfully in LDAP');
//       } else {
//         console.error('Error creating user in LDAP:', err);
//       }
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//   } finally {
//     mongoose.connection.close();  // Close the connection after the user is created
//   }
// };

// // Call the function to create the user
// createManualUser(utilisateur1);
// createManualUser(utilisateur2);





//endpoitn to get the user role
app.get("/user", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Server error");
  }
});
// pour enregistrer les fichiers dans le serveur
app.post("/upload", [verifyToken, upload.array("files")], async (req, res) => {
  try {
    console.log("User ID:", req.userId);
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    console.log("User:", user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Upload files to SFTP server
    let restPath = await sftp.cwd();
    console.log(restPath);
    restPath = restPath.slice(1, restPath.length);
    const userDir = path.join(restPath, user.DirPath);
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
    }
    res.status(200).send("Upload successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//download files
app.get("/download/:filename", verifyToken, async (req, res) => {
  try {
    const { filename } = req.params;
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1);
    const userDir = path.join(restPath, user.DirPath);
    const dirExists = await sftp.exists(userDir);
    if (!dirExists) return res.status(415).send("Directory not found");
    // sends the stream directly to the browser
    const filePath = path.posix.join(userDir, filename);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    sftp.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).send("Failed to download file");
  }
});

// pour renommer les fichier
app.patch("/download/:filename", verifyToken, async (req, res) => {
  try {
    console.log("start renaming");
    const { filename } = req.params;
    console.log(filename);
    const newFilename = req.body.nom;
    console.log("new file name:" + newFilename);
    // Check if req.userId is set correctly
    console.log("User ID:", req.userId);
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    console.log("User:", user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    let restPath = await sftp.cwd();
    console.log(restPath);
    restPath = restPath.slice(1, restPath.length);
    console.log(restPath);
    const userDir = path.join(restPath, user.DirPath);
    const dirExists = await sftp.exists(userDir);
    console.log("Directory exists:", dirExists);
    if (!dirExists) return res.status(415).send("Directory not found");
    const lastPath = path.join(userDir, filename);
    console.log(lastPath);
    const newPath = path.join(userDir, newFilename);
    console.log(newPath);
    const renameexists = await sftp.exists(newPath);
    console.dir(renameexists);
    if (renameexists)
      return res.status(409).send("name already exists choose another one");
    await sftp.rename(lastPath, newPath);
    res.status(200).send("name changed succefully");
  } catch (err) {
    console.log(err);
  }
});

// pour afficher les fichier
app.get("/download", verifyToken, async (req, res) => {
  try {
    // Check if req.userId is set correctly
    // console.log('User ID:', req.userId);
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    // console.log('User:', user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    let restPath = await sftp.cwd();
    restPath = restPath.slice(1, restPath.length);
    // console.log(restPath);
    const userDir = path.join(restPath, user.DirPath);
    const dirExists = await sftp.exists(userDir);
    // console.log('Directory exists:', dirExists);
    if (!dirExists) return res.status(415).send("Directory not found");
    const files = await sftp.list(userDir);
    // console.log('Files:', files);
    res.status(200).send({ files });
  } catch (err) {
    console.log("Erreur de requete" + err);
  }
});
app.post("/paths/create", verifyToken, async (req, res) => {
  console.log("POST /paths/create hit");
  const { pathName } = req.body;
  console.log("paaaaath:" + pathName);
  try {
    console.log("User ID: ==>", req.userId);
    if (!req.userId) {
      return res.status(401).send("User ID not found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("user not found POST /paths/create");
      return res.status(404).json({ message: "User not found" });
    }
    let restPath = await sftp.cwd();
    console.log(restPath);
    restPath = restPath.slice(1, restPath.length);
    console.log(restPath);
    const fullPath = path.join(restPath, pathName);
    // Create the directory on the SFTP server
    const directoryExists = await sftp.exists(fullPath);
    if (!directoryExists) {
      await sftp.mkdir(fullPath, true);
      console.log(`Directory created: ${fullPath}`);
    } else {
      return res.status(400).json({ message: "Directory already exists" });
    }

    const newPath = new Path({
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
const buildFileTree = async (sftp, dirPath) => {
  try {
    const access = await canReadPath(dirPath);
    if (access) {
      const items = await sftp.list(dirPath);
      const tree = [];

      for (let item of items) {
        if (item.type === "d") {
          let children = await buildFileTree(sftp, `${dirPath}/${item.name}`);
          if (!children) {
            children = [];
            // Add dummy child to ensure directory can be expanded
            children.push({
              id: `${dirPath}/${item.name}/dummy`,
              label: "",
            });
          }
          tree.push({
            id: `${dirPath}/${item.name}`,
            label: item.name,
            children,
          });
        } else {
          tree.push({
            id: `${dirPath}/${item.name}`,
            label: item.name,
          });
        }
      }
      return tree;
    } else {
      return null;
    }
  } catch (err) {
    // Skip directories that can't be accessed due to permission issues
    console.error(`Skipped directory ${dirPath} due to error:`, err.message);
    return null;
  }
};

app.get("/tree-files", async (req, res) => {
  try {
    const restPath = await sftp.cwd();
    const fileTree = await buildFileTree(sftp, restPath);
    res.json(fileTree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

process.on("SIGINT", () => {
  disconnectSFTP().then(() => {
    process.exit();
  });
});
app.listen("3000", () => {
  console.log("Server is running on port 3000...");
});
