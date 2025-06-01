const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all classification data
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    if (isNaN(inv_id)) {
      throw new Error("Invalid inventory ID")
    }

    const data = await pool.query(`SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
    return null
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    return null
  }
}

async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
    const values = [
      data.classification_id, data.inv_make, data.inv_model, data.inv_year, data.inv_description,
      data.inv_image, data.inv_thumbnail, data.inv_price, data.inv_miles, data.inv_color
    ]
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    return null
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory
}