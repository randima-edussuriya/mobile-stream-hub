import dbPool from "../../config/dbConnection.js";

export const getAllOrders = async (req, res) => {
  try {
    const { district, status } = req.query;

    const filters = [];
    const conditions = [];

    if (district && district.trim()) {
      conditions.push(`d.district = ?`);
      filters.push(district.trim());
    }

    if (status && status.trim()) {
      conditions.push(`ot.status = ?`);
      filters.push(status.trim());
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderSql = `
          SELECT ot.*, d.district 
          FROM order_table ot
          INNER JOIN delivering d ON ot.order_id=d.order_id
          ${whereClause}
          ORDER BY order_date DESC
          `;

    const [orders] = await dbPool.query(orderSql, filters);

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
      SELECT ot.*, d.*, p.payment_date as payment_date, p.status as payment_status, p.token as payment_token
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

    // update payment date for 'completed' status
    if (paymentStatus === "completed") {
      const paymentDateSql =
        "UPDATE payment SET payment_date = NOW() WHERE order_id = ?";
      await dbPool.query(paymentDateSql, [orderId]);
    }

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

export const updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentDate, paymentToken } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!paymentDate && !paymentToken) {
      return res.status(400).json({
        success: false,
        message: "Either payment date or payment token is required",
      });
    }

    const updateSql = `UPDATE payment SET token=?, payment_date=? WHERE order_id = ?`;
    await dbPool.query(updateSql, [paymentToken, paymentDate, orderId]);

    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const { userId } = req.user;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    // Check if order exists and is pending
    const [orderRows] = await dbPool.query(
      "SELECT status FROM order_table WHERE order_id = ?",
      [orderId],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderRows[0].status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // Insert cancellation record
    await dbPool.query(
      `INSERT INTO cancellation (reason, status, user_type, order_id, staff_id) 
         VALUES (?, 'cancelled', 'staff', ?, ?)`,
      [reason.trim(), orderId, userId],
    );

    // Update order status to cancelled
    await dbPool.query(
      "UPDATE order_table SET status = 'cancelled' WHERE order_id = ?",
      [orderId],
    );

    // Get order items to restore stock
    const [orderItemsRows] = await dbPool.query(
      "SELECT item_id, item_quantity FROM order_item WHERE order_id = ?",
      [orderId],
    );

    // Restore stock for each item
    for (const item of orderItemsRows) {
      await dbPool.query(
        "UPDATE item SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
        [item.item_quantity, item.item_id],
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock restored",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getCancellations = async (req, res) => {
  try {
    const sql = `
      SELECT 
        cancel_id,
        cancel_date,
        reason,
        status,
        user_type,
        order_id,
        COALESCE(staff_id, customer_id) as user_id
      FROM cancellation
      ORDER BY cancel_date DESC
    `;

    const [cancellations] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: cancellations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getOrderDistricts = async (req, res) => {
  try {
    const sql = `SELECT DISTINCT district FROM delivering ORDER BY district ASC`;
    const [rows] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: rows.map((r) => r.district),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getOrderStatuses = async (req, res) => {
  try {
    const sql = `SELECT DISTINCT status FROM order_table ORDER BY status ASC`;
    const [rows] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: rows.map((r) => r.status),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
