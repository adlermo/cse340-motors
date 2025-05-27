const utilities = require("../utilities/")

/* 404 Not Found Handler */
const notFound = async (err, req, res, next) => {
    const nav = await utilities.getNav()

    if (err.status !== 404) return next(err) // If it's not a 404 error, pass it to the next error handler

    const errorDetails = `
    <div class="error-details">
        <p><strong>Message:</strong> ${err.message || "Sorry, the page you requested was not found"}</p>
        <img src="/images/vehicles/no-image.png" alt="Error Image" class="error-image">
    </div>`

    res.status(404).render("error", {
        title: "Page Not Found",
        nav,
        message: errorDetails,
        status: 404
    })
}

/* General Error Handler */
const serverError = async (err, req, res, next) => {
    const nav = await utilities.getNav()

    const errorDetails = `
    <div class="error-details">
        <p><strong>Message:</strong> ${err.message || "An unexpected error occurred"}</p>
        <img src="/images/vehicles/no-image.png" alt="Error Image" class="error-image">
    </div>`

    res.status(err.status || 500).render("error", {
        title: "Server Error",
        nav,
        message: errorDetails,
        status: err.status || 500
    })
}

module.exports = { notFound, serverError }