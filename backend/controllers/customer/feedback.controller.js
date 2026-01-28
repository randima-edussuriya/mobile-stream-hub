import dbPool from "../../config/dbConnection.js";

export const addOrderFeedback = async (req, res) => {
  try {
    const { message, rating, orderId, itemId } = req.body;
    const { userId } = req.user;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ratingValue = Number(rating);
    if (Number.isNaN(ratingValue)) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (ratingValue < 0 || ratingValue > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // verify that the item belongs to the user's order
    const verifyOrderItemSql =
      "SELECT 1 FROM order_item WHERE order_id=? AND item_id=?";
    const [orderItemRows] = await dbPool.query(verifyOrderItemSql, [
      orderId,
      itemId,
    ]);
    if (orderItemRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The specified item does not belong to the given order",
      });
    }

    const sql = `
      INSERT INTO feedback (message, rating, service_type, customer_id, item_id)
      VALUES (?, ?, 'order', ?, ?)
    `;

    await dbPool.query(sql, [message.trim(), ratingValue, userId, itemId]);

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
