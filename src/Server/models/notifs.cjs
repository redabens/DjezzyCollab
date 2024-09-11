const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const notifSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["download", "upload"],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notif = mongoose.model("Notif", notifSchema);

module.exports = Notif;
