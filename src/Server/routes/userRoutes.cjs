const express = require("express");
const userController = require("../logic/userController.cjs");

const router = express.Router();

router.post("/signUp", userController.createUser); // creation compte pour un nouvel utilisateur
module.exports = router;
