/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const bodyParser = require("body-parser")
const utilities = require("./utilities/")

const static = require("./routes/static")
// Importing controllers and routes
const baseController = require("./controllers/baseController")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/account", require("./routes/accountRoute"))

// Example route to trigger a server error
app.use("/server-error", (req, res, next) => {
  const err = new Error("This is a server error example")
  err.status = 500
  next(err)
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let title = 'Error'
  let message = ''

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  if (err.status == 404) {
    title = 'Page Not Found'
    message = `
    <div class="error-details">
        <p><strong>Message:</strong> ${err.message || "Sorry, the page you requested was not found"}</p>
        <img src="/images/vehicles/car-not-found.jpg" alt="Error Image" class="error-image">
    </div>`
  } else {
    title = 'Server Error'
    message = `
    <div class="error-details">
        <p><strong>Message:</strong> ${err.message || "An unexpected error occurred"}</p>
        <img src="/images/vehicles/server-error.png" alt="Error Image" class="error-image">
    </div>`
  }
  res.render("errors/error", {
    title: title,
    nav,
    message,
    status: err.status || 500,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`)
})
