import dbPool from "../../config/dbConnection.js";

export const getAllInquiries = async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.inquiry_id,
        i.inquired_at,
        i.message,
        i.reply,
        i.replyed_at,
        i.staff_id,
        i.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email,
        CONCAT(s.first_name, ' ', s.last_name) as staff_name
      FROM inquiry i
      INNER JOIN customer c ON i.customer_id = c.customer_id
      LEFT JOIN staff s ON i.staff_id = s.staff_id
      ORDER BY i.inquired_at DESC
    `;

    const [inquiries] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const replyToInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { reply } = req.body;
    const staffId = req.user.userId;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    // Check if inquiry exists
    const [inquiryRows] = await dbPool.query(
      "SELECT inquiry_id FROM inquiry WHERE inquiry_id = ?",
      [inquiryId],
    );

    if (inquiryRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Update inquiry with reply
    const sql = `
      UPDATE inquiry 
      SET reply = ?, replyed_at = NOW(), staff_id = ? 
      WHERE inquiry_id = ?
    `;

    await dbPool.query(sql, [reply.trim(), staffId, inquiryId]);

    // get updated inquiry details
    const updatedInquirySql = `
            SELECT i.inquiry_id, i.reply, i.replyed_at, i.staff_id, CONCAT(s.first_name, ' ', s.last_name) as staff_name
            FROM inquiry i
            INNER JOIN staff s ON s.staff_id=i.staff_id
            WHERE inquiry_id=?   
    `;
    const [updatedInquiryRows] = await dbPool.query(updatedInquirySql, [
      inquiryId,
    ]);
    const updatedInquiry = updatedInquiryRows[0];

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
