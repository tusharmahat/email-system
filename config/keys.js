/**
 * keys.js that contains credentials
 * to run the server and to connect
 * to the database
 *
 * @author Tushar
 */
var username = "group6"; // username
var password = "germany%40front%4046"; // password
var localHost = "127.0.0.1"; //local host IP address
var localPort = "27017"; // port number of the local port
var database = "group6"; // name of database

// create the credentials string used for database connection
var credentialsString ="mongodb://uojihcpaqrkui95mcih1:W3AjD6nsQjwyOILSW7VZ@bf83o6yl2qal8vh-mongodb.services.clever-cloud.com:27017/bf83o6yl2qal8vh";

//   "mongodb://" +
//   username +
//   ":" +
//   password +
//   "@" +
//   localHost +
//   ":" +
//   localPort +
//   "/" +
//   database;

// export modules
module.exports = {
  MongoURI: credentialsString,
};
