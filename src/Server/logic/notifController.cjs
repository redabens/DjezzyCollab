const Notif = require("../models/notifs.cjs");

const addNotif = async (req, res = null) => {
    const { userId, type, fileName } = req.body; 
    if (!userId || !type || !fileName) {
      if (res) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields",
        });
      } else {
        console.error("Missing required fields");
        return;
      }
    }
    try {
      await Notif.create({
        userId,
        type,
        fileName,
        createdAt: new Date(),
      });
      if (res) {
        res.status(201).json({
          status: "success",
          message: "Notif added",
        });
      } else {
        console.log("Notif added successfully");
      }
    } catch (err) {
      console.log("error addNotif: " + err);
      if (res) {
        res.status(500).json({
          status: "error",
          message: "Can't create the notification",
        });
      } else {
        console.error("Can't create the notification");
      }
    }
  };
  
const getAllNotifs = async (req, res) => {
    try {
      const notifs = await Notif.find();
      res.status(200).json({
        status: "success",
        data: notifs,
      });
    } catch (err) {
      console.log("error getAllNotifs: " + err);
      res.status(500).json({
        status: "error",
        message: "ERROR fetching notifs",
      });
    }
  };
  module.exports = { addNotif, getAllNotifs};