const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ldapSchema = new Schema({
  url: { type: String, required: true },
  adminDN: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
    default: 389,
  },
});

const Ldap = mongoose.model("Ldap", ldapSchema);
module.exports = Ldap;
