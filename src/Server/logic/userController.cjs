const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users.cjs");
const { message } = require("antd");
const { deleteUserFromLDAP } = require("./ldap.cjs");

const createUser = async (req, res) => {
  const data = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    await User.create({
      ...data,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      message: "User created",
    });
  } catch (err) {
    console.log("error createUser: " + err);
    res.status(500).json({
      status: "error",
      message: "Can't create the user",
    });
  }
};

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

    await User.findByIdAndDelete(userId);
    deleteUserFromLDAP(user.email, (success, err) => {
      if (success) {
        res.status(200).json({
          status: "success",
          message: "User deleted successfully",
        });
      } else {
        console.error("Failed to delelte user from LDAP: ", err);
        res.status(500).json({
          status: "error",
          message: "User deleted from DB but not from LDAP",
        });
      }
    });
  } catch (err) {
    console.log("Error deleting user: " + err);
    res.status(500).json({ status: "error", message: "Error deleting user" });
  }
};

module.exports = { createUser, getAllUsers, deleteUser };
