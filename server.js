/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
//const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const path = require("path")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(cookieParser())

// 
app.use(async (req, res, next) => {
  let nav = await utilities.getNav()
  res.locals.nav = nav
  next()
})

/* ***********************
 * Index Routes
 *************************/
app.use("/inv", inventoryRoute)
app.use("/error", errorRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use(express.static("public"))

app.use("/images", express.static(path.join(__dirname, "/public/images")))
app.use("/css", express.static(path.join(__dirname, "/public/css")))
app.use("/js", express.static(path.join(__dirname, "/public/js")))


/* ***********************
 * Local Server Information

 *************************/
const port = process.env.PORT
const host = process.env.HOST



app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


