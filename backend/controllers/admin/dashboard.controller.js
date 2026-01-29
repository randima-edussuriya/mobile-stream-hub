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
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getOrderStatusDistribution = async (req, res) => {
  try {
    const sql = `
            SELECT ot.status as name, COUNT(ot.order_id) as value
            FROM order_table ot
            WHERE ot.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY ot.status
            ORDER BY value DESC`;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getPaymentMethodDistribution = async (req, res) => {
  try {
    const sql = `
                SELECT ot.payment_method AS name, COUNT(ot.order_id) AS value
                FROM order_table ot
                WHERE ot.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY ot.payment_method
                ORDER BY value DESC;
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getOrderDistrictDistribution = async (req, res) => {
  try {
    const sql = `
            SELECT d.district AS name, COUNT(ot.order_id) as value
            FROM delivering d
            INNER JOIN order_table ot ON d.order_id=ot.order_id
            WHERE ot.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            	AND ot.status NOT IN ("cancelled")
            GROUP BY d.district
            ORDER BY value DESC;
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getRevenueByOrder = async (req, res) => {
  try {
    const sql = `
        SELECT DATE_FORMAT(ot.order_date, '%Y-%m') AS name, SUM(ot.total) AS value
        FROM order_table ot
        INNER JOIN payment p ON ot.order_id=p.order_id
        WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        	AND p.status = "completed"
        GROUP BY name
        ORDER BY name ASC;
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getRevenueByCategory = async (req, res) => {
  try {
    const sql = `
        SELECT 
        	c.category_name AS name,
            SUM(
                (oi.item_price-(oi.item_price*oi.discount/100))*oi.item_quantity
            ) AS value
        FROM category c
        INNER JOIN item i ON c.category_id=i.category_id
        INNER JOIN order_item oi ON i.item_id=oi.item_id
        INNER JOIN order_table ot ON oi.order_id=ot.order_id
        INNER JOIN payment p ON ot.order_id=p.order_id
        WHERE p.payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        	AND p.status="completed"
        GROUP BY c.category_id
        ORDER BY VALUE DESC;
    `;

    const [data] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
