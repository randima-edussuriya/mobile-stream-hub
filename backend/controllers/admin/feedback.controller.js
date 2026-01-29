import dbPool from "../../config/dbConnection.js";

export const getAllItemFeedbacks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        f.feedback_id,
        f.feedback_date,
        f.message,
        f.status,
        f.rating,
        i.name as item_name
      FROM feedback f
      INNER JOIN item i ON f.item_id = i.item_id
      WHERE f.service_type = 'order'
      ORDER BY f.feedback_date DESC
    `;

    const [feedbacks] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getItemFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!feedbackId) {
      return res.status(400).json({
        success: false,
        message: "Feedback ID is required",
      });
    }

    const sql = `
      SELECT 
        f.feedback_id,
        f.feedback_date,
        f.message,
        f.status,
        f.rating,
        f.customer_id,
        f.managed_by as managed_by_id,
        i.name as item_name,
        i.brand as item_brand,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        CONCAT(s.first_name, ' ', s.last_name) as managed_by_name
      FROM feedback f
      INNER JOIN customer c ON f.customer_id = c.customer_id
      INNER JOIN item i ON f.item_id = i.item_id
      LEFT JOIN staff s ON f.managed_by = s.staff_id
      WHERE f.feedback_id = ? AND f.service_type = 'order'
      LIMIT 1
    `;

    const [feedbacks] = await dbPool.query(sql, [feedbackId]);

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: feedbacks[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;
    const { userId } = req.user;

    if (!feedbackId) {
      return res.status(400).json({
        success: false,
        message: "Feedback ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Check if feedback exists
    const [feedbackRows] = await dbPool.query(
      "SELECT feedback_id FROM feedback WHERE feedback_id = ?",
      [feedbackId],
    );

    if (feedbackRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Update feedback status and managed_by
    const updateSql = `
      UPDATE feedback 
      SET status = ?, managed_by = ? 
      WHERE feedback_id = ?
    `;
    await dbPool.query(updateSql, [status, userId, feedbackId]);

    return res.status(200).json({
      success: true,
      message: "Feedback status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
