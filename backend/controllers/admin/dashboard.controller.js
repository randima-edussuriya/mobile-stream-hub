import dbPool from "../../config/dbConnection.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get customer count
    const [customerCount] = await dbPool.query(
      "SELECT COUNT(*) as count FROM customer",
    );

    // Get product count
    const [productCount] = await dbPool.query(
      "SELECT COUNT(*) as count FROM item",
    );

    // Get category count
    const [categoryCount] = await dbPool.query(
      "SELECT COUNT(*) as count FROM category",
    );

    // Get order count
    const [orderCount] = await dbPool.query(
      "SELECT COUNT(*) as count FROM order_table",
    );

    return res.status(200).json({
      success: true,
      data: {
        customers: customerCount[0].count,
        products: productCount[0].count,
        categories: categoryCount[0].count,
        orders: orderCount[0].count,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getOrderStatusDistribution = async (req, res) => {
  try {
    const sql = `
      SELECT status as name, COUNT(order_id) as value
      FROM order_table
      GROUP BY status
      ORDER BY value DESC
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getPaymentMethodDistribution = async (req, res) => {
  try {
    const sql = `
      SELECT payment_method as name, COUNT(order_id) as value
      FROM order_table
      GROUP BY payment_method
      ORDER BY value DESC
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getRevenueByOrder = async (req, res) => {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(order_date, '%Y-%m') as name,
        SUM(total) as value
      FROM order_table
      WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(order_date, '%Y-%m')
      ORDER BY name ASC
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
