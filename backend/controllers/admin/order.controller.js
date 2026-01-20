import dbPool from "../../config/dbConnection.js";

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await dbPool.query(
      "SELECT * FROM order_table ORDER BY order_date DESC",
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Get order details
    const orderSql = `
      SELECT ot.*, d.*, p.payment_date as payment_date, p.status as payment_status
      FROM order_table ot
      INNER JOIN delivering d ON d.order_id=ot.order_id
      INNER JOIN payment p ON p.order_id=ot.order_id
      WHERE ot.order_id=? LIMIT 1;
    `;

    const [orderRows] = await dbPool.query(orderSql, [orderId]);

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderRows[0];

    // Get order items
    const itemsSql = `
      SELECT i.item_id, i.name, oi.item_price, oi.item_quantity, oi.discount
      FROM order_item oi
      INNER JOIN item i ON oi.item_id=i.item_id
      WHERE oi.order_id=?;
    `;

    const [items] = await dbPool.query(itemsSql, [orderId]);

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        items,
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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Update order status
    const updateSql = "UPDATE order_table SET status = ? WHERE order_id = ?";
    await dbPool.query(updateSql, [status, orderId]);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    // Update payment status
    const updateSql = "UPDATE payment SET status = ? WHERE order_id = ?";
    await dbPool.query(updateSql, [paymentStatus, orderId]);

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updatePaymentDate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentDate } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!paymentDate) {
      return res.status(400).json({
        success: false,
        message: "Payment date is required",
      });
    }

    // Update payment date
    const updateSql = "UPDATE payment SET payment_date = ? WHERE order_id = ?";
    await dbPool.query(updateSql, [paymentDate, orderId]);

    return res.status(200).json({
      success: true,
      message: "Payment date updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
