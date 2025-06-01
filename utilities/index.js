const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += `
            <li>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_color} ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}"/>
            </a>
            <div class="namePrice">
                <hr />
                <h2>
                <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                    ${vehicle.inv_make} ${vehicle.inv_model}
                </a>
                </h2>
                <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
            </div>
            </li>
            `
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build inventory details view HTML
* ************************************ */
Util.buildInventoryDetails = async function (data) {
    let card
    console.log("data", data)
    if (data.length === 0) {
        return '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }

    const vehicle = data[0]
    card = `
    <div class="detail">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} image" />
        <div class="detail-info">
            <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
            <h2 class="price">Price: $${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.inv_price).replace('$', '')}</h2>
            <ul>
                <li><strong>Year:</strong> ${vehicle.inv_year}</li>
                <li><strong>Make:</strong> ${vehicle.inv_make}</li>
                <li><strong>Model:</strong> ${vehicle.inv_model}</li>
                <li><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>
                <li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>
                <li><strong>Color:</strong> ${vehicle.inv_color}</li>
                <li><strong>Description:</strong> ${vehicle.inv_description}</li>
            </ul>
        </div>
    </div>
    `

    return card
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build classification list for adding inventory item
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

module.exports = Util