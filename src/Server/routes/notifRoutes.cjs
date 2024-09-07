const express = require("express");
const notifController = require("../logic/notifController.cjs");

const router = express.Router();
router.get("/", notifController.getAllNotifs);
router.post("/create", notifController.addNotif);
module.exports = router;
