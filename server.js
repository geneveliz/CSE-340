/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const bodyParser = require("body-parser");
const invController = require('./controllers/invController');
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
const pool = require('./database/');
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const accountRoute = require("./routes/accountRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.get('/inv/type/:classificationId', invController.buildByClassificationId);
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Middleware
 *************************/
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});

app.use(async (req, res, next) => {
  let nav = await utilities.getNav();
  res.locals.nav = nav;
  next();
});

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "/public/images")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));

/* **********************
 * Routes
 *************************/

app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/error", errorRoute);
app.use("/account", accountRoute);

/* ***********************
 * Local Server Information

 * ************************/

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`);
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});


app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});