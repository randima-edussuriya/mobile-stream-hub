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
