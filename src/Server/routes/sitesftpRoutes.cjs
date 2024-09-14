const express = require("express");
const router = express.Router();
const {addSiteSFTP,visualiseSiteSFTP,getSiteSFTP,editSiteSftp} = require("../logic/sitesftpController.cjs");
const {verifyToken} = require("../logic/functions.cjs");

router.post("/add",verifyToken,addSiteSFTP);
router.patch('/edit/:id',editSiteSftp)
router.post("/visualise",visualiseSiteSFTP);
router.get("/",getSiteSFTP);
module.exports = router;