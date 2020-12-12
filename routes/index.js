/**
 * index.js
 * main route
 *
 * @author Tushar
 */
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
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Home",
          name: req.user.name,
          inbox: user.inbox,
          badge: count,
          type: user.type,
        }
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
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Inbox",
          name: req.user.name,
          inbox: user.inbox,
          badge: count,
          type: user.type,
        }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});
// ------------------------------------VIEW AN EMAIL ROUTES---------------------------------------//
//View an inbox email
router.get("/inbox/-:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "inbox");
});
router.get("/sent/-:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "sent");
});
router.get("/deleted/-:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "deleted");
});
router.get("/fav/-:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "fav");
});
router.get("/unread/-:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "unread");
});

/**
 * This function send the respective email to be viewed as a response from
 * the respective box
 * @author Tushar
 *
 * @param {*} req
 * @param {*} res
 * @param {*} box
 */
function readThisEmail(req, res, box) {
  //Get index from the route
  const i = parseInt(req.params.i);
  var query = { email: req.user.email };
  //Find the inbox emails of this user
  User.findOne(query)
    .then((user) => {
      //number of unread emails
      const count = countUnread(user.inbox);
      var resData;
      if (box == "sent") {
        resData = {
          page: "Sent Items",
          name: req.user.name,
          sent: user.sent,
          badge: count,
          view: user.sent[i],
          type: user.type,
          index: i,
        };

        res.render(
          "home",
          //Passing the resData as response
          resData
        );
      } else if (box == "deleted") {
        resData = {
          page: "Deleted Emails",
          name: req.user.name,
          deleted: user.deleted,
          badge: count,
          view: user.deleted[i],
          type: user.type,
          index: i,
        };

        res.render(
          "home",
          //Passing the resData as response
          resData
        );
      } else {
        // If unread emails change into read
        user.inbox[i].read = true;
        var updateObj = {
          inbox: user.inbox,
        };
        User.findOneAndUpdate(query, updateObj, { new: true }, (err, email) => {
          if (box == "inbox") {
            resData = {
              page: "Inbox",
              name: req.user.name,
              inbox: email.inbox,
              badge: count,
              view: email.inbox[i],
              type: user.type,
              index: i,
            };
          } else if (box == "fav") {
            resData = {
              page: "Favorites",
              name: req.user.name,
              fav: email.inbox,
              badge: count,
              view: email.inbox[i],
              type: user.type,
              index: i,
            };
          } else {
            resData = {
              page: "Unread",
              name: req.user.name,
              unread: email.inbox,
              badge: count,
              view: email.inbox[i],
              type: user.type,
              index: i,
            };
          }
          res.render(
            "home",
            //Passing the resData as response
            resData
          );
        });
      }
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
}
//-------------------------------------------------------------------------------------------//

//View sent items
router.get("/sent", ensureAuthenticated, (req, res) => {
  //Find the sent emails of this user
  User.findOne({ email: req.user.email })
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Sent Items",
          name: req.user.name,
          sent: user.sent,
          badge: count,
          type: user.type,
        }
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
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Favorites",
          name: req.user.name,
          fav: user.inbox,
          badge: count,
          type: user.type,
        }
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
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Unread Emails",
          name: req.user.name,
          unread: user.inbox,
          badge: count,
          type: user.type,
        }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});

//View sent items
router.get("/deleted", ensureAuthenticated, (req, res) => {
  User.findOne({ email: req.user.email })
    .then((user) => {
      const count = countUnread(user.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Deleted Emails",
          name: req.user.name,
          deleted: user.deleted,
          badge: count,
          type: user.type,
        }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});
// Manage account handle
router.get("/manage-acc", ensureAuthenticated, (req, res) => {
  // Find all users from the database
  User.find()
    .then((users) => {
      var names = [];
      var emails = [];
      var types = [];
      for (var i = 0; i < users.length; i++) {
        names.push(users[i].name);
        emails.push(users[i].email);
        types.push(users[i].type);
      }
      User.findOne({ email: req.user.email }).then((user) => {
        // Send response
        res.render(
          "home",
          //Passing the user resData as response
          {
            page: "Manage Accounts",
            name: req.user.name,
            names: names,
            emails: emails,
            types: types,
            type: user.type,
          }
        );
      });
    })
    .catch((err) => {
      console.log("Error while getting accounts, Error: " + err);
    });
});
//View sent items
router.get("/search/:box", ensureAuthenticated, (req, res) => {
  var box = req.params.box;
  //Find the inbox emails of this user
  User.findOne({ email: req.user.email })
    .then((user) => {
      switch (box) {
        case "inbox":
          res.send(user.inbox);
          break;
        case "sent":
          res.send(user.sent);
          break;
        case "deleted":
          res.send(user.deleted);
          break;
      }
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});
function countUnread(inbox) {
  var count = 0;
  inbox.forEach((email) => {
    if (!email.read) {
      count += 1;
    }
  });
  return count;
}

module.exports = router;
