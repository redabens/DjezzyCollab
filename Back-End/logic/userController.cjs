const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users.cjs");
const SiteSFTP = require("../models/sitesftp.cjs");
const {search} = require("./ldap.cjs");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log("error getAllUsers: " + err);
    res.status(500).json({
      status: "error",
      message: "ERROR fetching users",
    });
  }
};

// delete user by id

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(409).json({
        status: "error",
        message: "User not deleted ",
      });
    }
    res.status(200).send("user deleted succefully")
  } catch (err) {
    console.log("Error deleting user: " + err);
    res.status(500).json({ status: "error", message: "Error deleting user" });
  }
};

const updateUser = async (req, res) => {
  const data = req.body;
  try {
    //get checked serveur sftp
    const checkedSite = await SiteSFTP.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
    let newDirPath = data.user.DirPath;
    // Trouver l'index de l'objet correspondant dans DirPath
    const index = newDirPath.findIndex(
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
    newDirPath[index].path = data.updatedUserData.userPath;
    const user = await User.findByIdAndUpdate(
      data.user._id,
      {
        DirPath: newDirPath,
        role: data.updatedUserData.role,
        ableToDelete: data.updatedUserData.ableToDelete,
      },
      { new: false }
    );
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    console.log("Error updating user: " + err);
    res.status(500).json({
      status: "error",
      message: "Error updating user",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }
    //get checked serveur sftp
    const checkedSite = await SiteSFTP.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
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
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
      userPath: userPath,
    });
  } catch (err) {
    console.log("Error fetching the user: " + err);
    res.status(500).json({
      status: "error",
      message: "Error fetching user",
    });
  }
};

const searchUserLDAP = async (req,res)=>{
    try {
      const {username} = req.body;
      console.log("username",username);
      const find = await search(username);
      if(!find){
          return res.status(401).send({error: 'Utilisateur inexistant dans LDAP'})
      }
      res.status(200).send("utilisateur existe dans LDAP");
    } catch (error) {
        console.log('Error searching user: '+error);
        res.status(500).send({error: 'Error searching user due to ldap'});
    }
}
module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
  searchUserLDAP,
};
