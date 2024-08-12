const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const secret = "Abdelhak_kaid_El_Hadj_Andjechairi"; // Change to a strong secret
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const SFTPClient = require("ssh2-sftp-client");
//---
const userRoutes = require("../routes/userRoutes.cjs");
// express configuration
const app = express();

// Set up multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
// file import
const User = require("../models/users.cjs");

mongoose
  .connect("mongodb://localhost:27017/Djezzy-Collab", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log(error.message));

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

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    console.log(user);
    if (!user) return res.status(404).send("user not found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send("the password is incorrect");
    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: 86400 });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send("Erro logging in");
  }
});
// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("No token provided");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(500).send("Failed to authenticate token");
    req.userId = decoded._id;
    console.log(req.userId);
    next();
  });
}
app.post("/upload", [verifyToken, upload.array("files")], async (req, res) => {
  try {
    let restPath = "";
    await sftp
      .connect(sftpconfig)
      .then((res) => {
        console.log("connected");
        return sftp.cwd();
      })
      .then((p) => {
        restPath = p;
        console.log("Current dir:", p);
      });
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
    // Upload files to SFTP server
    restPath = restPath.slice(1, restPath.length);
    console.log(restPath);
    const userDir = path.join(restPath, user.DirPath);
    const dirExists = await sftp.exists(userDir);
    console.log("Directory exists:", dirExists);
    if (!dirExists) await sftp.mkdir(userDir, true);
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      console.log(file);
      const remotePath = path.join(userDir, file.originalname);
      console.log("Remote path:", remotePath);
      await sftp.put(file.buffer, remotePath);
    }
    res.status(200).send("Upload successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  } finally {
    await sftp.end();
  }
});
app.get("/download", verifyToken, async (req, res) => {
  try {
    let restPath = "";
    await sftp
      .connect(sftpconfig)
      .then((res) => {
        console.log("connected");
        return sftp.cwd();
      })
      .then((p) => {
        restPath = p;
        console.log("Current dir:", p);
      });
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
    restPath = restPath.slice(1, restPath.length);
    console.log(restPath);
    const userDir = path.join(restPath, user.DirPath);
    const dirExists = await sftp.exists(userDir);
    console.log("Directory exists:", dirExists);
    if (!dirExists) return res.status(415).send("Directory not found");
    const files = await sftp.list(userDir);
    console.log("Files:", files);
    res.status(200).send({ files });
  } catch (err) {
  } finally {
    await sftp.end();
  }
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
// const createUser = async () => {
//   const hashedPassword = await bcrypt.hash("sara2004", 10);
//   const sara = new User({
//     firstName: "Sara Amina",
//     lastName: "Iratni",
//     email: "ms_iratni@esi.dz",
//     password: hashedPassword,
//   });
//   await sara.save();
//   console.log("User created with hashed password");
// };

// createUser();
app.listen("3000", () => {
  console.log("Server is running on port 3000...");
});