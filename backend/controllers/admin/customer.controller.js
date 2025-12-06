import dbPool from "../../config/dbConnection.js";

export const getAllCustomers = async (req, res) => {
  try {
    const sql = `
              SELECT customer_id, first_name, last_name, email, is_active, phone_number, address, created_at
              FROM customer ORDER BY customer_id ASC;`;
    const [customers] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateCustomerStatus = async (req, res) => {
  try {
    const { customerId, isActive } = req.body;

    // check if customer exists
    const sqlCheck = "SELECT 1 FROM customer WHERE customer_id=?";
    const [rows] = await dbPool.query(sqlCheck, [customerId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const sql = "UPDATE customer SET is_active=? WHERE customer_id=?";
    await dbPool.query(sql, [isActive, customerId]);
    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
