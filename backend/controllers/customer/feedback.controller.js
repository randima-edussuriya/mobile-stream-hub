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

export const addRepairFeedback = async (req, res) => {
  try {
    const { message, rating, repairId } = req.body;
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

    if (!repairId) {
      return res.status(400).json({
        success: false,
        message: "Repair ID is required",
      });
    }

    // verify that the repair belongs to the user
    const verifyRepairSql =`
        SELECT 1 FROM repair r
        INNER JOIN repair_request rr ON r.repair_requests_id=rr.repair_requests_id
        WHERE r.repair_id=? AND rr.customer_id=?`;
    const [repairRows] = await dbPool.query(verifyRepairSql, [
      repairId,
      userId,
    ]);
    if (repairRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The specified repair does not belong to you",
      });
    }

    const sql = `
      INSERT INTO feedback (message, rating, status, service_type, customer_id, repair_id)
      VALUES (?, ?, 'accepted', 'repair', ?, ?)
    `;

    await dbPool.query(sql, [message.trim(), ratingValue, userId, repairId]);

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

export const getItemFeedbacks = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Get average rating
    const avgRatingSql = `
      SELECT 
        COALESCE(AVG(f.rating), 0) as average_rating,
        COUNT(f.feedback_id) as total_feedbacks
      FROM feedback f
      WHERE f.item_id = ?
        AND f.service_type = 'order'
        AND f.status = 'accepted'
    `;

    const [avgRatingRows] = await dbPool.query(avgRatingSql, [itemId]);
    const averageRating = Number(avgRatingRows[0].average_rating || 0).toFixed(
      1,
    );
    const totalFeedbacks = avgRatingRows[0].total_feedbacks || 0;

    // Get individual feedbacks
    const sql = `
      SELECT 
        f.feedback_id,
        f.feedback_date,
        f.message,
        f.rating,
        c.first_name,
        c.last_name
      FROM feedback f
      INNER JOIN customer c ON f.customer_id = c.customer_id
      WHERE f.item_id = ?
        AND f.service_type = 'order'
        AND f.status = 'accepted'
      ORDER BY f.feedback_date DESC
    `;

    const [rows] = await dbPool.query(sql, [itemId]);

    return res.status(200).json({
      success: true,
      data: {
        averageRating,
        totalFeedbacks,
        feedbacks: rows,
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
