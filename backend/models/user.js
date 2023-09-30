// MODELO DE ESQUEMA DE USUARIOS
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  signUpDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("User", userSchema);
