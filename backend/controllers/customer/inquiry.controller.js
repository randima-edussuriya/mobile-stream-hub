import { sendSubmitInquiryEmail } from "../../services/email/customerEmail.service.js";
import dbPool from "../../config/dbConnection.js";

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, address, phoneNo, subject, message } = req.body;

    // Check if customer exists with this email and is active
    const [customerRows] = await dbPool.query(
      "SELECT customer_id FROM customer WHERE email = ? AND is_active = TRUE",
      [email],
    );

    // If customer exists and is active, insert into inquiry table
    if (customerRows.length > 0) {
      const customerId = customerRows[0].customer_id;
      await dbPool.query(
        "INSERT INTO inquiry (message, customer_id) VALUES (?, ?)",
        [message, customerId],
      );
    }

    // Send email regardless of whether customer exists
    await sendSubmitInquiryEmail({
      name,
      email,
      address,
      phoneNo,
      subject,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getMyInquiries = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const sql = `
      SELECT 
        inquiry_id,
        inquired_at,
        message,
        reply,
        replyed_at,
        staff_id
      FROM inquiry
      WHERE customer_id = ?
      ORDER BY inquired_at DESC
    `;

    const [inquiries] = await dbPool.query(sql, [customerId]);

    return res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
