const express = require("express");
const userController = require("../logic/userController.cjs");

const router = express.Router();

router.post("/signUp", userController.createUser); // creation compte pour un nouvel utilisateur
router.delete("/:id", userController.deleteUser);//1
router.get('/:id',userController.getUserById);//1
router.put("/:id", userController.updateUser);//1
router.get("/", userController.getAllUsers);//1

module.exports = router;
