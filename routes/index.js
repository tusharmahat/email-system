const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//User model
const User = require("../models/User");

//Welcome page
router.get("/", (req, res) => {
  res.render(`login`);
});

//home showing the inbox
router.get("/home", ensureAuthenticated, (req, res) => {
  //Find the inbox emails of this user
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, inbox: email.inbox }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/inbox", ensureAuthenticated, (req, res) => {
  //Find the inbox emails of this user
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, inbox: email.inbox }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/sent", ensureAuthenticated, (req, res) => {
  //Find the sent emails of this user
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, sent: email.sent }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/fav", ensureAuthenticated, (req, res) => {
  //Find the sent emails of this user
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, fav: email.inbox }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/unread", ensureAuthenticated, (req, res) => {
  //Find the inbox emails of this user
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, unread: email.inbox }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/deleted", ensureAuthenticated, (req, res) => {
  User.findOne({ email: req.user.email })
    .then((email) => {
      res.render(
        "home",
        //Passing the user data as response
        { name: req.user.name, deleted: email.deleted }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

module.exports = router;
