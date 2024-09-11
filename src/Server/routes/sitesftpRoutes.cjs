const express = require("express");
const router = express.Router();
const {addSiteSFTP,visualiseSiteSFTP,getSiteSFTP,editSiteSftp} = require("../logic/sitesftpController.cjs");

router.post("/add",addSiteSFTP);
router.patch('/edit/:id',editSiteSftp)
router.post("/visualise",visualiseSiteSFTP);
router.get("/",getSiteSFTP);
module.exports = router;