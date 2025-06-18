// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login",
    utilities.checkJWTToken,
    utilities.handleErrors(accountController.buildLogin))
router.get("/register",
    utilities.checkJWTToken,    
    utilities.handleErrors(accountController.buildRegister))

// Route to handle login
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Route to update account info
router.get("/update/:accountId",
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

// POST updated account info
router.post("/update-info",
    utilities.checkJWTToken,
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccountInfo)
)

// POST new password
router.post("/update-password",
    utilities.checkJWTToken,
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

// Logout Route
router.get("/logout",
    utilities.handleErrors(accountController.logoutAccount)
);

// Route to build account management view
router.get("/",
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router;
