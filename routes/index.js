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
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Home",
          name: req.user.name,
          inbox: email.inbox,
          badge: count,
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
    .then((email) => {
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Inbox",
          name: req.user.name,
          inbox: email.inbox,
          badge: count,
        }
      );
    })
    .catch((err, aff, res) => {
      console.log(err);
    });
});
// ------------------------------------VIEW AN EMAIL ROUTES---------------------------------------//
//View an inbox email
router.get("/inbox/:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "inbox");
});
router.get("/sent/:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "sent");
});
router.get("/deleted/:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "deleted");
});
router.get("/fav/:i", ensureAuthenticated, (req, res) => {
  readThisEmail(req, res, "fav");
});
router.get("/unread/:i", ensureAuthenticated, (req, res) => {
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
    .then((email) => {
      //number of unread emails
      const count = countUnread(email.inbox);
      var resData;
      if (box == "sent") {
        resData = {
          page: "Sent Items",
          name: req.user.name,
          sent: email.sent,
          badge: count,
          view: email.sent[i],
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
          deleted: email.deleted,
          badge: count,
          view: email.deleted[i],
        };

        res.render(
          "home",
          //Passing the resData as response
          resData
        );
      } else {
        // If unread emails change into read
        email.inbox[i].read = true;
        var updateObj = {
          inbox: email.inbox,
        };
        User.findOneAndUpdate(query, updateObj, { new: true }, (err, email) => {
          if (box == "inbox") {
            resData = {
              page: "Inbox",
              name: req.user.name,
              inbox: email.inbox,
              badge: count,
              view: email.inbox[i],
            };
          } else if (box == "fav") {
            resData = {
              page: "Favorites",
              name: req.user.name,
              fav: email.inbox,
              badge: count,
              view: email.inbox[i],
            };
          } else {
            resData = {
              page: "Unread",
              name: req.user.name,
              unread: email.inbox,
              badge: count,
              view: email.inbox[i],
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
    .then((email) => {
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Sent Items",
          name: req.user.name,
          sent: email.sent,
          badge: count,
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
    .then((email) => {
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Favorites",
          name: req.user.name,
          fav: email.inbox,
          badge: count,
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
    .then((email) => {
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Unread Emails",
          name: req.user.name,
          unread: email.inbox,
          badge: count,
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
    .then((email) => {
      const count = countUnread(email.inbox);
      res.render(
        "home",
        //Passing the user resData as response
        {
          page: "Deleted Emails",
          name: req.user.name,
          deleted: email.deleted,
          badge: count,
        }
      );
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
