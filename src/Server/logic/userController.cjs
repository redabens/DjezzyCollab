const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users.cjs");

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

module.exports = { createUser };
