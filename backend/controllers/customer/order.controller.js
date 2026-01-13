import dbPool from "../../config/dbConnection.js";

export const getCustomerOrders = async (req, res) => {};
export const getCustomerOrder = async (req, res) => {};
export const placeOrder = async (req, res) => {};

// Get delivery cost by area name
export const getDeliveryCost = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).json({
        success: false,
        message: "Delivery district is required",
      });
    }

    const sql =
      "SELECT cost as shipping_cost FROM deliver_area WHERE deliver_area_name = ?";
    const [rows] = await dbPool.query(sql, [district]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery area not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
