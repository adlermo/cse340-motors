const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory details view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
    console.log("buildByInventoryId")
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryById(inventory_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const invName = data.inv_make + " " + data.inv_model
    res.render("./inventory/details", {
        title: invName,
        nav,
        grid,
    })
}

module.exports = invController