const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        if (data.length === 0) {
            if (data.length === 0) {
                const err = new Error('No vehicles found for this classification')
                err.status = 404
                return next(err)
            }
        }
        const className = data[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Build inventory details view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
    try {

        const inventory_id = req.params.inventoryId
        const data = await invModel.getInventoryById(inventory_id)
        const details = await utilities.buildInventoryDetails(data)
        let nav = await utilities.getNav()
        if (data.length === 0) {
            const err = new Error('No vehicle details found with that ID')
            err.status = 404
            return next(err)
        }
        const invName = data[0].inv_make + " " + data[0].inv_model
        res.render("./inventory/details", {
            title: invName,
            nav,
            details,
            errors: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = invController