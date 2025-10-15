/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

require('dotenv').config();

/* Required -  Modules*/
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

/* Custom - Modules */
const utilities = require("./utilities");
const pool = require("./database/");
const baseController = require("./controllers/baseController");
const invController = require("./controllers/invController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const errorRoute = require("./routes/errorRoute");

/* App Configuration */
const app = express();

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "/public/images")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));

// Body  - parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie - parser
app.use(cookieParser());

// Session - management
const sessionSecret = process.env.SESSION_SECRET || "defaultsecret";
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});

/* Inject JWT login state into all views */
const jwtSecret = process.env.JWT_SECRET || "defaultjwtsecret";
app.use((req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      res.locals.loggedIn = true;
      res.locals.firstname = decoded.firstname;
      res.locals.account_type = decoded.account_type;
      res.locals.decodedToken = decoded; 
      req.user = decoded; 
    } catch (err) {
      console.log("JWT error:", err.message);
      res.locals.loggedIn = false;
      res.locals.firstname = null;
      res.locals.account_type = null;
      res.locals.decodedToken = null;
    }
  } else {
    res.locals.loggedIn = false;
    res.locals.firstname = null;
    res.locals.account_type = null;
    res.locals.decodedToken = null;
  }
  next();
});

/* Inject nav menu */
app.use(async (req, res, next) => {
  try {
    const nav = await utilities.getNav();
    res.locals.nav = nav;
    next();
  } catch (err) {
    next(err);
  }
});

/* Route Definitions */
app.get("/", utilities.handleErrors(baseController.buildHome));
app.get("/inv/type/:classificationId", invController.buildByClassificationId);

app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/error", errorRoute);

/* Error Handlers */

// Not found 404
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Express (Error handler)
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* Server Listener */
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
