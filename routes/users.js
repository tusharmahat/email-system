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
  res.render(`login`, { page: "Login" });
});

//register page
router.get("/register", (req, res) => {
  res.render(`register`, { page: "Register" });
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

//-----------------------SEND & DELETE HANDLES--------------------------//
//Send Handle
router.post("/send", ensureAuthenticated, (req, res) => {
  // Date of email creation
  const date = new Date();
  // Make email object
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

  //Query to search recipient
  var query = { email: email.to };

  //Update object for the recipient's inbox
  const updateObj1 = {
    $push: {
      inbox: {
        $each: [email],
        $position: 0,
      },
    },
  };

  //Update object for the sender sent items
  const updateObj2 = {
    $push: {
      sent: {
        $each: [email],
        $position: 0,
      },
    },
  };

  //find the recipient
  User.findOne(query)
    .then((user) => {
      if (user.inbox.length < 50) {
        //If the recipient's inbox is not full then send
        User.updateOne(query, updateObj1).catch((err) => {
          console.log(err);
        });

        // //Query to search the sender
        query = { email: req.user.email };

        // Update sent items of the sender
        User.findOne(query).then((user) => {
          if (user.sent.length < 50) {
            //If the recipient's sent items is not full then send
            User.updateOne(query, updateObj2).then(() => {
              // If sent redirect to sent items
              res.redirect("/sent");
            });
          } else {
            // If the sents items is full sent flash msg
            req.flash("success_msg", "Your sent items is full");
          }
        });
      } else {
        // If the inobx is full sent flash msg
        req.flash("success_msg", "Recipient's inbox is full");
        // Redirect to inbox
        res.redirect("/inbox");
      }
    })
    .catch((err) => {
      // Console log error
      req.flash("success_msg", "Recipient's email address invalid");
      // Redirect to inbox
      res.redirect("/inbox");
      console.log("Error while sending email. Error: " + err);
    });
});

//Delete this email
router.post("/:box/delete-one/:index", ensureAuthenticated, (req, res) => {
  //Get the index of the email being deleted
  const i = parseInt(req.params.index.split(":")[1]);

  //Query to search the user
  const query = { email: req.user.email };

  // Options to update the document
  const options = {
    upsert: true,
    new: true,
  };

  // Get that email from the db
  User.findOne(query)
    .then((user) => {
      // emails variable
      var emails = "";

      switch (req.params.box) {
        case "inbox":
          // If the box is inbox, get inbox emails
          emails = user.inbox;
          break;
        case "sent":
          // If the box is sent, get sent emails
          emails = user.sent;
          break;
        case "deleted":
          // If the box is deleted, get deleted emails
          emails = user.deleted;
      }

      //delete email
      const deleted = emails.splice(i, 1);

      // Deleted obj variable
      var deleteObj;

      // Push the deleted email to the deleted box
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
        findAndUpdate(query, deleteObj, options);
      }

      // update variable for other boxes
      var updateObj;

      if (req.params.box == "inbox") {
        // Update for inbox
        updateObj = {
          inbox: emails,
        };
      } else if (req.params.box == "sent") {
        // Update for sent
        updateObj = {
          sent: emails,
        };
      } else if (req.params.box == "deleted") {
        // Update for deleted
        updateObj = {
          deleted: emails,
        };
      }

      // Update the data in the box after deletion
      findAndUpdate(query, updateObj, options);
      // Redirect to the respective box
      res.redirect(`/${req.params.box}`);
    })
    .catch((err) => {
      console.log("Error while fetching the email");
    });
});

//Delete all email of this box
router.post("/:box/delete-all", ensureAuthenticated, (req, res) => {
  //Query to search the user
  const query = { email: req.user.email };
  // Options for findOneAndUpdate
  const options = {
    upsert: true,
    new: true,
  };

  // Get that email from the db
  User.findOne(query)
    .then((user) => {
      //deleted emails variable
      var deleted = [];
      // According to the box, set the deleted emails
      switch (req.params.box) {
        case "inbox":
          deleted = user.inbox;
          break;
        case "sent":
          deleted = user.sent;
          break;
        case "deleted":
          deleted = user.deleted;
      }

      //delete email
      var deleteObj;

      // If the email being deleted from the deleted box, then delete it permanently
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
        findAndUpdate(query, deleteObj, options);
      }

      // If it is deleted from other box, then send it to deleted box
      var updateObj = {};
      //update the
      if (req.params.box == "inbox") {
        updateObj = {
          inbox: [],
        };
      } else if (req.params.box == "sent") {
        updateObj = {
          sent: [],
        };
      } else if (req.params.box == "deleted") {
        updateObj = {
          deleted: [],
        };
      }

      // Update the data
      findAndUpdate(query, updateObj, options);
      // Redirect to the respective box
      res.redirect(`/${req.params.box}`);
    })
    .catch((err) => {
      console.log("Error while fetching the email");
    });
});

// Unread count handle
router.get("/unread-count", ensureAuthenticated, (req, res) => {
  // Find the userfrom the database
  const query = { email: req.user.email };
  User.findOne(query)
    .then((user) => {
      // Variable unread count
      var count = 0;

      // Count the unread emails
      for (var i = 0; i < user.inbox.length; i++) {
        if (!user.inbox[i].read) {
          count++;
        }
      }
      // Send response
      res.send({ count: count, url: "./unread" });
    })
    .catch((err) => {
      console.log("Error while counting the unread emails, Error: " + err);
    });
});

//Add email to favorite
router.post("/:box/add-to-fav/:index", ensureAuthenticated, (req, res) => {
  //Get the index of the email being deleted
  const i = parseInt(req.params.index.split(":")[1]);
  //Query to search the user
  const query = { email: req.user.email };
  // Options for findOneAndUpdate
  const options = {
    upsert: true,
    new: true,
  };

  // Find that user from the db
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

      //update the inbox of the user in the database
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

/**
 * Mongoose find and update, to make code clean
 *
 * @param {*} query
 * @param {*} updateObj
 * @param {*} options
 */
function findAndUpdate(query, updateObj, options) {
  //Change the status to read and update the database
  User.findOneAndUpdate(query, updateObj, options).catch((err) => {
    console.log("Error while find and update, Error: " + err);
  });
}

module.exports = router;
