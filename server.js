/**
 * server.js main app to run server
 * @author Tushar
 */

// import required modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const compression = require("compression");

//Passport config
require("./config/passport")(passport);

// Express router
const app = express();

// enable recognition of incoming data as JSON
app.use(express.json());
// incoming values in name:value pairs can be any type (true below)
app.use(express.urlencoded({ extended: true }));

// static assets like javascript and css are served from these folders
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/css", express.static(__dirname + "/css"));
// root
app.use(express.static(__dirname));

// set up allowance characteristics for cross-origin resource sharing (CORS)
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


//DB config
const mongoUri = process.env.MONGO_URI;
console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");

//connect to mongo
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//EJS middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash());

//flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.alert_msg = req.flash("alert_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5001;

// Run server
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
