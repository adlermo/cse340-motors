const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res, next) {
  try {
    // You can add any logic here if needed before rendering the home page
    const nav = await utilities.getNav()

    res.render("index", { title: "Home", nav, errors: null })
  } catch (error) {
    next(error)
  }
}

module.exports = baseController