// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Add Classification
router.get("/add-classification", invController.buildAddClassification)
router.post("/add-classification", invController.addClassification)

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", invController.addInventory)

// Inventory management view
router.get("/", invController.buildManagement)

module.exports = router;
