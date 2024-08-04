const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
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

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    console.log(user);
    if (user) {
      if (user.password === req.body.password) {
        res.send("success");
      } else {
        res.send("the password is incorrect");
      }
    } else {
      res.send("The user is not Registred");
    }
  } catch (error) {
    console.log(error.message);
  }
});
app.post("/upload", upload.array("files"), (req, res) => {
  try {
    // Log the file names
    console.dir(req.files);

    res.send("Files uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading files");
  }
});
app.listen("3000", () => {
  console.log("Server is running on port 3000...");
});
