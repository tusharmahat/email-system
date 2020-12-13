/**
 * passport.js for password validation
 * that use local strategy
 *
 * @author Tushar
 */
//Validate password
const localStrategy = require("passport-local").Strategy;
//mongoose
const mongoose = require("mongoose");
// Bcrypt
const bcrypt = require("bcryptjs");

//load user modal
const User = require("../models/User");

// Export passport model
module.exports = function (passport) {
  passport.use(
    // Use local strategy
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match user
      User.findOne({ email: email })
        .then((user) => {
          // If the user is not found
          if (!user) {
            return done(null, false, {
              message: "This email is not registered",
            });
          }
          //Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  // Serilize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserilize user
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
