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
var credentialsString ="mongodb+srv://tusharmahat:Sasha200101@cluster0.h6cz2xs.mongodb.net/test";

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
