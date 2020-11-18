//------------------------------REQUIRED IMPORTS------------------------//
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Bcrypt
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User model
const User = require("../models/User");

//---------------------LOGIN & REGISTER PAGE RENDER---------------------//
//login page
router.get("/login", (req, res) => {
  res.render(`login`);
});

//register page
router.get("/register", (req, res) => {
  res.render(`register`);
});

//---------------------REGISTER HANDLE---------------------//
//Register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2, type } = req.body;
  let errors = [];
  //check for required fields
  if (!name || !email || !password || !password2 || !type) {
    errors.push({ msg: "Please fill in all fields" });
  } else {
    //Check passwords match
    if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
    }

    //Check passwords length
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
      type,
    });
  } else {
    //Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exists
        errors.push({ msg: "Email is already registered." });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          type,
        });
      } else {
        //new user
        const newUSer = new User({
          name,
          email,
          password,
          type,
        });

        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUSer.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed password
            newUSer.password = hash;

            //Save new user, and send success message to flash
            newUSer
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    });
  }
});

//-----------------------SEND,VIEW & DELETE HANDLES--------------------------//
//Send Handle
router.post("/send", ensureAuthenticated, (req, res) => {
  const date = new Date();
  const email = {
    from: req.user.email,
    to: req.body.to,
    cc: req.body.cc,
    sb: req.body.sb,
    msg: req.body.msg,
    fav: false,
    read: false,
    date: date.toJSON(),
  };

  var query = { email: req.user.email };
  var updateObj = {
    $push: {
      sent: {
        $each: [email],
        $position: 0,
      },
    },
  };
  //Update the sent emails of this user
  findAndUpdate(query, updateObj);
  query = { email: email.to };
  updateObj = {
    $push: {
      inbox: {
        $each: [email],
        $position: 0,
      },
    },
  };
  //Sent the emails to the receiver
  findAndUpdate(query, updateObj);

  res.redirect("/inbox");
});

//View this users email
router.get("/:box/view/:index", ensureAuthenticated, (req, res) => {
  //Parameter index
  const i = parseInt(req.params.index.split(":")[1]);

  //Parameters for find and update
  const query = { email: req.user.email };
  const options = {
    upsert: true,
    new: true,
  };

  // Get that email from the db
  User.findOne(query)
    .then((user) => {
      // Send it to the front end
      if (req.params.box == "inbox") {
        user.inbox[i].read = true;
        var updateObj = {
          inbox: user.inbox,
        };
        //Change the status to read and update the database
        findAndUpdate(query, updateObj, options);

        //Send the email to the front end
        res.send(user.inbox[i]);
      } else {
        //Send the email to the front end
        res.send(user.sent[i]);
      }
    })
    .catch((err) => {
      console.log("Error while fetching the email");
    });
});

//View this users email
router.post("/:box/delete-one/:index", ensureAuthenticated, (req, res) => {
  //Parameter for email index
  const i = parseInt(req.params.index.split(":")[1]);

  //Parameters for find and update
  const query = { email: req.user.email };
  const options = {
    upsert: true,
    new: true,
  };

  // Get that email from the db
  User.findOne(query)
    .then((user) => {
      var emails = "";
      switch (req.params.box) {
        case "inbox":
          emails = user.inbox;
          break;
        case "sent":
          emails = user.sent;
          break;
        case "deleted":
          emails = user.deleted;
      }

      //delete email
      const deleted = emails.splice(i, 1);
      var deleteObj;
      if (req.params.box != "deleted") {
        deleteObj = {
          $push: {
            deleted: {
              $each: deleted,
              $position: 0,
            },
          },
        };
        //Update deleted data
        findAndUpdate(query, deleteObj);
      }
      var updateObj;
      //update the
      if (req.params.box == "inbox") {
        updateObj = {
          inbox: emails,
        };
      } else if (req.params.box == "sent") {
        updateObj = {
          sent: emails,
        };
      } else if (req.params.box == "deleted") {
        updateObj = {
          deleted: emails,
        };
      }
      findAndUpdate(query, updateObj, options);
      res.redirect(`/${req.params.box}`);
    })
    .catch((err) => {
      console.log("Error while fetching the email");
    });
});

//Add to favorite this email
router.post("/:box/add-to-fav/:index", ensureAuthenticated, (req, res) => {
  //Parameter for email index
  const i = parseInt(req.params.index.split(":")[1]);
  //Parameters for find and update
  const query = { email: req.user.email };
  const options = {
    upsert: true,
    new: true,
  };

  // Get that email from the db
  User.findOne(query)
    .then((user) => {
      if (user.inbox[i].fav) {
        //Remove from fav
        user.inbox[i].fav = false;
      } else {
        //Add to fav
        user.inbox[i].fav = true;
      }

      //updated inbox
      var updateObj = {
        inbox: user.inbox,
      };
      //update he database
      findAndUpdate(query, updateObj, options);

      //redirect to from where it was triggered
      res.redirect(`/${req.params.box}`);
    })
    .catch((err) => {
      console.log("Error while fetching the email");
    });
});

//----------------------------LOGIN & LOGOUT HANDLE--------------------------//
//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
//Logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are now logged out");
  res.redirect("/users/login");
});

function findAndUpdate(query, updateObj, options) {
  //Change the status to read and update the database
  User.findOneAndUpdate(query, updateObj, options).catch((err) => {
    console.log("Error while saving the email");
  });
}

module.exports = router;
