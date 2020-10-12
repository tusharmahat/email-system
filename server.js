/**
 * @author Tushar Mahat (A00429666)
 * @author Akrit Malla (A00433147)
 * P3: Admin Email System
 * This file demonstrates setting up a connection
 * to a Mongo database, as well as saving and
 * retrieving data. It employs the MongoDB API
 * functions drop(), insertOne() and findOne().
 * */

// Import the Express framework
var express = require("express");

// Import the MongoDB API
var mongodb = require("mongodb");

var username = "group6"; // username
var password = "germany%40front%4046"; // password
var localHost = "127.0.0.1"; //local host IP address
var localPort = "27017"; // port number of the local port
var database = "group6"; // name of database

// create the credentials string used for database connection: mongodb://t_mahat:A00429666127.0.0.1:27017/t_mahat
var credentialsString =
  "mongodb://" +
  username +
  ":" +
  password +
  "@" +
  localHost +
  ":" +
  localPort +
  "/" +
  database;

// Access the express framework via the variable server
var server = express();

// set port variable
var port = 3095;

// enable recognition of incoming data as JSON
server.use(express.json());
// incoming values in name:value pairs can be any type (true below)
server.use(express.urlencoded({ extended: true }));

// static assets like javascript and css are served from these folders
server.use("/scripts", express.static(__dirname + "/scripts"));
server.use("/css", express.static(__dirname + "/css"));
// root
server.use(express.static(__dirname));

// set up allowance characteristics for cross-origin resource sharing (CORS)
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
server.use(allowCrossDomain);

//Get funtion to send the admin email system if the url is /admin
//If the default URL is used, it will open client email system
server.get("/admin", function (req, res) {
  res.sendFile(__dirname + "/indexA.html");
});

/* post function to save admin inbox to mongodb, after that callback function dropThenInsertAdminInbox inserts admin inbox emails to mongodb */
server.post("/sendToAdminInbox", dropThenInsertAdminInbox);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function dropThenInsertAdminInbox(req, res) {
  /* Deletes admin inbox emails from mongodb */
  globalDB.collection("adminInbox").drop(function (dropError, dropSuccess) {
    if (dropSuccess) {
      /* Deletes and inserts admin inbox emails to mongodb, No need to parse as req.body is alrady a JSON object */
      globalDB.collection("adminInbox").insertOne(req.body, insertCallback);
    } else if (dropError)
      // Throws the error object containing detailed info
      throw dropError;
  });
  /**
   * This callback function is executed after insertOne() has completed all its tasks.
   * @param {*} err errors thrown
   */
  function insertCallback(err) {
    // status(200) sets the HTTP status for the response.
    // send("Insert Successful") sends the HTTP response.
    if (err == null) return res.status(200).send("Insert Successful");
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post function to get admin inbox to mongodb, after that callback function getAdminInboxCallback is called which sends admin inbox emails as response */
server.post("/getAdminInbox", getAdminInboxCallback);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function getAdminInboxCallback(req, res) {
  globalDB.collection("adminInbox").findOne({}, findCallback);
  /**
   * Function to send the found emails as http response
   * @param {*} err error occured
   * @param {object} foundRecord found emails
   */
  function findCallback(err, foundRecord) {
    if (err == null) {
      // status(200) sets the HTTP status for the response.
      // sends admin inbox emails as the HTTP response.
      return res.status(200).send(foundRecord.emails);
    }
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post function to save client sentitems from mongodb, after that callback function dropThenInsertClientSentItems inserts client sent emails to mongodb */
server.post("/sendToClientSentItems", dropThenInsertClientSentItems);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function dropThenInsertClientSentItems(req, res) {
  /* Deletes clientSentItems from mongodb */
  globalDB
    .collection("clientSentItems")
    .drop(function (dropError, dropSuccess) {
      if (dropSuccess) {
        /* Deletes and inserts client sent emails to mongodb, No need to parse as req.body is alrady a JSON object */
        globalDB
          .collection("clientSentItems")
          .insertOne(req.body, insertCallback);
      } else if (dropError)
        // Throws the error object containing detailed info
        throw dropError;
    });
  /**
   * This callback function is executed after insertOne() has completed all its tasks.
   * @param {*} err errors thrown
   */
  function insertCallback(err) {
    // status(200) sets the HTTP status for the response.
    // send("Insert Successful") sends the HTTP response.
    if (err == null) return res.status(200).send("Insert Successful");
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post to get client sent items from mongodb, after that callback function getClientSentItems is called which sends client sent emails as response */
server.post("/getClientSentItems", getClientSentItems);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function getClientSentItems(req, res) {
  globalDB.collection("clientSentItems").findOne({}, findCallback);
  /**
   * Function to send the found emails as http response
   * @param {*} err error occured
   * @param {object} foundRecord found emails
   */
  function findCallback(err, foundRecord) {
    if (err == null) {
      // status(200) sets the HTTP status for the response.
      // sends admin inbox emails as the HTTP response.
      return res.status(200).send(foundRecord.emails);
    }
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post function to save client inbox to mongodb, after that callback function dropThenInsertClientInbox inserts client inbox emails to mongodb */
server.post("/sendToClientInbox", dropThenInsertClientInbox);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function dropThenInsertClientInbox(req, res) {
  /* Deletes clientInbox from mongodb */
  globalDB.collection("clientInbox").drop(function (dropError, dropSuccess) {
    if (dropSuccess) {
      /* Deletes and inserts client inbox emails to mongodb, No need to parse as req.body is alrady a JSON object */
      globalDB.collection("clientInbox").insertOne(req.body, insertCallback);
    } else if (dropError)
      // Throws the error object containing detailed info
      throw dropError;
  });
  /**
   * This callback function is executed after insertOne() has completed all its tasks.
   * @param {*} err errors thrown
   */
  function insertCallback(err) {
    // status(200) sets the HTTP status for the response.
    // send("Insert Successful") sends the HTTP response.
    if (err == null) return res.status(200).send("Insert Successful");
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post to get client inbox from mongodb, after that callback function getClientInboxCallback is called which sends client inbox as response */
server.post("/getClientInbox", getClientInboxCallback);
/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function getClientInboxCallback(req, res) {
  globalDB.collection("clientInbox").findOne({}, findCallback);
  /**
   * Function to send the found emails as http response
   * @param {*} err error occured
   * @param {object} foundRecord found emails
   */
  function findCallback(err, foundRecord) {
    if (err == null) {
      // status(200) sets the HTTP status for the response.
      // sends admin inbox emails as the HTTP response.
      return res.status(200).send(foundRecord.emails);
    }
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post function to save admin sent items to mongodb, after that callback function dropThenInsertAdminInbox inserts admin sent items to mongodb */
server.post("/sendToAdminSentItems", dropThenInsertAdminSentItems);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function dropThenInsertAdminSentItems(req, res) {
  /* Deletes adminSentItems  from mongodb */
  globalDB.collection("adminSentItems").drop(function (dropError, dropSuccess) {
    if (dropSuccess) {
      /* Deletes and inserts admin sent items to mongodb, No need to parse as req.body is alrady a JSON object */
      globalDB.collection("adminSentItems").insertOne(req.body, insertCallback);
    } else if (dropError)
      // Throws the error object containing detailed info
      throw dropError;
  });
  /**
   * This callback function is executed after insertOne() has completed all its tasks.
   * @param {*} err errors thrown
   */
  function insertCallback(err) {
    // status(200) sets the HTTP status for the response.
    // send("Insert Successful") sends the HTTP response.
    if (err == null) return res.status(200).send("Insert Successful");
    // Throws the error object containing detailed info
    else throw err;
  }
}

/* post to get admin sent items from mongodb, after that callback function getAdminSentItemsCallback is called which sends admin sent items as response */
server.post("/getAdminSentItems", getAdminSentItemsCallback);

/**
 * The callback function that is executed when server.post completes its tasks.
 * @param {object} req is the request object
 * @param {*} res
 */
function getAdminSentItemsCallback(req, res) {
  globalDB.collection("adminSentItems").findOne({}, findCallback);
  /**
   * Function to send the found emails as http response
   * @param {*} err error occured
   * @param {object} foundRecord found emails
   */
  function findCallback(err, foundRecord) {
    if (err == null) {
      // status(200) sets the HTTP status for the response.
      // sends admin inbox emails as the HTTP response.
      return res.status(200).send(foundRecord.emails);
    }
    // Throws the error object containing detailed info
    else throw err;
  }
}

// Create a connection to your mongoDB database
mongodb.connect(
  credentialsString,
  { useUnifiedTopology: true },
  getDBReference
);

// global variable contains reference to the database
var globalDB;

function getDBReference(err, ref) {
  if (err == null) {
    // When a SIGTERM event occurs: log info; close DB; and close server (via the anonymous function).
    // An anonymous function is a function without a name. See the second argument to "process.on"
    // just below. It is "function () {...}"
    // SIGTERM is a signal intentionally generated by another process (not by the operating system).
    // It represents a controlled and deliberate administrative decision, to terminate the process.
    process.on("SIGTERM", function () {
      console.log("Shutting server down.");
      ref.close();
      server.close();
    });

    // initialize reference to the database
    globalDB = ref.db(database);

    // Start server listening on the port, and log the info (via the anonymous function)
    server.listen(port, function () {
      console.log("Listening on port " + port);
    });
  } else {
    // Throw the object err containing detailed error info
    throw err;
  }
}
