/**
 * User.js
 * contains User model which has
 * user schema having attributes:
 * User(user name, email, password,
 * type,inbox,sent,deleted,date)
 *
 * @author Tushar
 */
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  inbox: [],
  sent: [],
  deleted: [],
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
