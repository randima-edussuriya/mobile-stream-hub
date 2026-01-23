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

/**
 * PUT /api/admin/repairs/:requestId/status
 * Update repair request status
 */
export const updateRepairRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be: ${validStatuses.join(", ")}.`,
      });
    }

    const query = `UPDATE repair_request SET status = ? WHERE repair_requests_id = ?`;
    const [result] = await dbPool.query(query, [status, requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    return res.status(200).json({
      message: "Repair request status updated successfully.",
      data: { repair_requests_id: requestId, status },
    });
  } catch (error) {
    console.error("Error updating repair request status:", error);
    return res.status(500).json({
      message:
        "Failed to update repair request status. Please try again later.",
    });
  }
};

/**
 * GET /api/admin/repairs/records
 * List all repairs (after acceptance)
 */
export const getAllRepairs = async (req, res) => {
  try {
    const { userId, userRole } = req.user;

    let query = `
      SELECT
        r.repair_id,
        r.status AS repair_status,
        r.total_cost,
        r.repair_requests_id,
        rr.appointment_date,
        CONCAT(s.first_name, ' ', s.last_name) AS technician_name
      FROM repair r
      INNER JOIN repair_request rr ON r.repair_requests_id = rr.repair_requests_id
      INNER JOIN staff s ON rr.technician_id = s.staff_id
    `;

    const params = [];
    if (userRole === "technician") {
      query += " WHERE rr.technician_id = ?";
      params.push(userId);
    }

    query += " ORDER BY rr.appointment_date DESC";

    const [rows] = await dbPool.query(query, params);
    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error fetching repairs:", error);
    return res.status(500).json({
      message: "Failed to fetch repairs. Please try again later.",
    });
  }
};

/**
 * GET /api/admin/repairs/records/:repairId
 * Get detailed information for a specific repair
 */
export const getRepairDetail = async (req, res) => {
  try {
    const { repairId } = req.params;

    const query = `
      SELECT
        r.repair_id,
        r.status AS repair_status,
        r.total_cost,
        r.identified_issue,
        r.identified_device,
        r.repair_requests_id,
        rr.issue_description,
        rr.device_info,
        rr.appointment_date,
        rr.status AS request_status,
        rr.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
        c.email AS customer_email,
        c.phone_number AS customer_phone,
        rr.technician_id,
        CONCAT(s.first_name, ' ', s.last_name) AS technician_name,
        s.email AS technician_email,
        s.phone_number AS technician_phone,
        rr.created_at AS request_created_at,
        rr.updated_at AS request_updated_at
      FROM repair r
      INNER JOIN repair_request rr ON r.repair_requests_id = rr.repair_requests_id
      INNER JOIN customer c ON rr.customer_id = c.customer_id
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE r.repair_id = ?
    `;

    const [rows] = await dbPool.query(query, [repairId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Repair not found." });
    }

    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("Error fetching repair detail:", error);
    return res.status(500).json({
      message: "Failed to fetch repair detail. Please try again later.",
    });
  }
};

/**
 * POST /api/admin/accept-repairs
 * Create a repair record when accepting a repair request
 */
export const createRepairAcceptance = async (req, res) => {
  try {
    const {
      repairRequestId,
      status,
      totalCost,
      identifiedIssue,
      identifiedDevice,
    } = req.body;

    // Validate required fields
    if (
      !repairRequestId ||
      !status ||
      totalCost === undefined ||
      !identifiedIssue ||
      !identifiedDevice
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: repairRequestId, status, totalCost, identifiedIssue, identifiedDevice.",
      });
    }

    // check if repair request exists
    const [requestRows] = await dbPool.query(
      "SELECT repair_requests_id, status FROM repair_request WHERE repair_requests_id = ?",
      [repairRequestId],
    );
    if (requestRows.length === 0) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }
    // chech if repair request is already accepted
    if (requestRows[0].status === "accepted") {
      return res.status(400).json({
        message: "Repair request has already been accepted.",
      });
    }

    // Validate status
    const validStatuses = [
      "diagnostics completed",
      "repair in progress",
      "repair completed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be: diagnostics completed, repair in progress, or repair completed.",
      });
    }

    // Validate totalCost
    if (Number.isNaN(totalCost) || totalCost < 0) {
      return res.status(400).json({
        message: "Total cost must be a valid positive number.",
      });
    }

    const query = `
      INSERT INTO repair (status, total_cost, identified_issue, identified_device, repair_requests_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.query(query, [
      status,
      totalCost,
      identifiedIssue,
      identifiedDevice,
      repairRequestId,
    ]);

    // Update the status of the repair request to 'accepted'
    const updateRequestQuery = `UPDATE repair_request SET status = 'accepted' WHERE repair_requests_id = ?`;
    await dbPool.query(updateRequestQuery, [repairRequestId]);

    return res.status(201).json({
      success: true,
      message: "Repair record created successfully.",
    });
  } catch (error) {
    console.error("Error creating repair acceptance:", error);
    return res.status(500).json({
      message: "Failed to create repair record. Please try again later.",
    });
  }
};
