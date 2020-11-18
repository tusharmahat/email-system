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

module.exports = {
    MongoURI: credentialsString,
};
