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

/* ***************************
 *  Deliver Inventory Management View
 * ************************** */
invController.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            flash: { notice: req.flash("notice") }
        })
    } catch (err) {
        next(err)
    }
}

/* ***************************
 *  Deliver Add Classification View
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            flash: { notice: req.flash("notice") },
            errors: [],
            classification_name: ""
        })
    } catch (err) {
        next(err)
    }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invController.addClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const { classification_name } = req.body

        // Server-side validation
        const pattern = /^[A-Za-z0-9]+$/
        let errors = []
        if (!classification_name || !pattern.test(classification_name)) {
            errors.push({ msg: "Classification name must not contain spaces or special characters." })
        }
        if (errors.length > 0) {
            return res.status(400).render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                flash: { notice: req.flash("notice") },
                errors,
                classification_name
            })
        }

        // Insert into DB
        const result = await require("../models/inventory-model").addClassification(classification_name)
        if (result) {
            req.flash("notice", "Classification added successfully!")
            nav = await utilities.getNav() // Refresh nav to include new classification
            return res.status(201).render("inventory/management", {
                title: "Inventory Management",
                nav,
                flash: { notice: req.flash("notice") }
            })
        } else {
            req.flash("notice", "Failed to add classification.")
            return res.status(500).render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                flash: { notice: req.flash("notice") },
                errors: [{ msg: "Database insertion failed." }],
                classification_name
            })
        }
    } catch (err) {
        next(err)
    }
}


/* ***************************
 *  Deliver Add Inventory View
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            flash: { notice: req.flash("notice") },
            errors: [],
            ...req.body // sticky fields
        })
    } catch (err) {
        next(err)
    }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invController.addInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        console.log("Adding inventory with data:", req.body)
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        const {
            classification_id, inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        } = req.body

        // Server-side validation
        let errors = []
        if (!classification_id) errors.push({ msg: "Classification is required." })
        if (!inv_make) errors.push({ msg: "Make is required." })
        if (!inv_model) errors.push({ msg: "Model is required." })
        if (!inv_year || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year must be between 1900 and 2099." })
        if (!inv_description) errors.push({ msg: "Description is required." })
        if (!inv_image) errors.push({ msg: "Image path is required." })
        if (!inv_thumbnail) errors.push({ msg: "Thumbnail path is required." })
        if (!inv_price || inv_price < 0) errors.push({ msg: "Price must be a positive number." })
        if (!inv_miles || inv_miles < 0) errors.push({ msg: "Miles must be a positive number." })
        if (!inv_color) errors.push({ msg: "Color is required." })

        if (errors.length > 0) {
            return res.status(400).render("inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                classificationList,
                flash: { notice: req.flash("notice") },
                errors,
                ...req.body
            })
        }

        // Insert into DB
        const result = await require("../models/inventory-model").addInventory({
            classification_id, inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        })
        if (result) {
            req.flash("notice", "Inventory item added successfully!")
            nav = await utilities.getNav()
            return res.status(201).render("inventory/management", {
                title: "Inventory Management",
                nav,
                flash: { notice: req.flash("notice") }
            })
        } else {
            req.flash("notice", "Failed to add inventory item.")
            return res.status(500).render("inventory/add-inventory", {
                title: "Add Inventory",
                nav,
                classificationList,
                flash: { notice: req.flash("notice") },
                errors: [{ msg: "Database insertion failed." }],
                ...req.body
            })
        }
    } catch (err) {
        next(err)
    }
}



module.exports = invController