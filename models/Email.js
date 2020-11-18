const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  cc: {
    type: String,
    required: true,
  },
  sb: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports;
