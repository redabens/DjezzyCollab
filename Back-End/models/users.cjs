const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    //   required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  ableToDelete: {
    type: Boolean,
    default: function () {
      return this.role === "admin";
    },
  },
  DirPath: {
    type: Array,
    default: [
      // {
      //   serveurSFTP: {
      //     host: "172.25.80.1",
      //     port: 22,
      //     username: "sarair",
      //     password: "sara2004",
      //     defaultPath: "/Downloads/public",
      //   },
      //   path: "/Downloads/public",
      // },
      {
        serveurSFTP: {
          host: "127.0.0.1",
          port: 22,
          username: "redabens",
          password: "Redabens2004..",
          defaultPath: "/Downloads/public",
        },
        path: "/Downloads/public",
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
