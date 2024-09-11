const express = require("express");
const notifController = require("../logic/notifController.cjs");

const router = express.Router();
router.post("/create", notifController.addNotif);
router.get("/", notifController.getAllNotifs);
module.exports = router;
