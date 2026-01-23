import dbPool from "../../config/dbConnection.js";

/**
 * GET /api/admin/repairs
 * Get all customer repair requests with basic details
 */
export const getAllRepairRequests = async (req, res) => {
  try {
    const { userId, userRole } = req.user;

    let query = `
      SELECT 
        rr.repair_requests_id,
        rr.issue_description,
        rr.device_info,
        rr.status,
        rr.appointment_date,
        CONCAT(s.first_name, ' ', s.last_name) AS technician_name
      FROM repair_request rr
      INNER JOIN staff s ON rr.technician_id = s.staff_id
    `;

    // Filter based on user role
    if (userRole === "technician") {
      query += ` WHERE rr.technician_id = ?`;
    }

    query += ` ORDER BY rr.appointment_date DESC`;

    const params = userRole === "technician" ? [userId] : [];
    const [requests] = await dbPool.query(query, params);
    return res.status(200).json({ data: requests });
  } catch (error) {
    console.error("Error fetching repair requests:", error);
    return res.status(500).json({
      message: "Failed to fetch repair requests. Please try again later.",
    });
  }
};

/**
 * GET /api/admin/repairs/:requestId
 * Get detailed information for a specific repair request
 */
export const getRepairRequestDetail = async (req, res) => {
  try {
    const { requestId } = req.params;

    const query = `
      SELECT 
        rr.repair_requests_id,
        rr.issue_description,
        rr.device_info,
        rr.status,
        rr.appointment_date,
        rr.created_at,
        rr.updated_at,
        rr.customer_id,
        rr.technician_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
        c.email AS customer_email,
        c.phone_number AS customer_phone,
        CONCAT(s.first_name, ' ', s.last_name) AS technician_name,
        s.email AS technician_email,
        s.phone_number AS technician_phone
      FROM repair_request rr
      INNER JOIN customer c ON rr.customer_id = c.customer_id
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE rr.repair_requests_id = ?
    `;

    const [requests] = await dbPool.query(query, [requestId]);

    if (requests.length === 0) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    return res.status(200).json({ data: requests[0] });
  } catch (error) {
    console.error("Error fetching repair request detail:", error);
    return res.status(500).json({
      message:
        "Failed to fetch repair request details. Please try again later.",
    });
  }
};
