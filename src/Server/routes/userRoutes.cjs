const express = require("express");
const userController = require("../logic/userController.cjs");

const router = express.Router();

router.post("/signUp", userController.createUser); // creation compte pour un nouvel utilisateur
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

module.exports = router;
