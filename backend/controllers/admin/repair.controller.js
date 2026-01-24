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
 * PUT /api/admin/repairs/records/:repairId
 * Update repair details (total_cost, identified_issue, identified_device)
 */
export const updateRepairDetails = async (req, res) => {
  try {
    const { repairId } = req.params;
    const { totalCost, identifiedIssue, identifiedDevice } = req.body;

    // Validate required fields
    if (!totalCost && !identifiedIssue && !identifiedDevice) {
      return res.status(400).json({
        message: "At least one field must be provided to update.",
      });
    }

    if (totalCost !== undefined) {
      if (Number.isNaN(Number(totalCost)) || Number(totalCost) < 0) {
        return res.status(400).json({
          message: "Total cost must be a valid positive number.",
        });
      }
    }

    const query = `
                UPDATE repair 
                SET total_cost = ?, identified_issue = ?, identified_device = ? 
                WHERE repair_id = ?`;
    const [result] = await dbPool.query(query, [
      totalCost,
      identifiedIssue,
      identifiedDevice,
      repairId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Repair not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Repair details updated successfully.",
    });
  } catch (error) {
    console.error("Error updating repair details:", error);
    return res.status(500).json({
      message: "Failed to update repair details. Please try again later.",
    });
  }
};

/**
 * PUT /api/admin/repairs/records/:repairId/status
 * Update repair status
 */
export const updateRepairStatus = async (req, res) => {
  try {
    const { repairId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "diagnostics completed",
      "repair in progress",
      "repair completed",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be: ${validStatuses.join(", ")}.`,
      });
    }

    const query = `UPDATE repair SET status = ? WHERE repair_id = ?`;
    const [result] = await dbPool.query(query, [status, repairId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Repair not found.",
      });
    }

    return res.status(200).json({
      message: "Repair status updated successfully.",
      data: { repair_id: repairId, status },
    });
  } catch (error) {
    console.error("Error updating repair status:", error);
    return res.status(500).json({
      message: "Failed to update repair status. Please try again later.",
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

/**
 * GET /api/admin/repairs/technicians
 * Get all active technicians
 */
export const getActiveTechnicians = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.staff_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone_number
      FROM staff s
      INNER JOIN staff_type st ON s.staff_type_id = st.staff_type_id
      WHERE st.staff_type_name = 'technician' AND s.is_active = TRUE
      ORDER BY s.first_name ASC
    `;

    const [technicians] = await dbPool.query(query);

    return res.status(200).json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error("Error fetching active technicians:", error);
    return res.status(500).json({
      message: "Failed to fetch technicians. Please try again later.",
    });
  }
};

/**
 * PUT /api/admin/repairs/:requestId/technician
 * Update technician for a repair request
 */
export const updateRepairTechnician = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        message: "Technician ID is required.",
      });
    }

    // Check if repair request exists
    const [requestRows] = await dbPool.query(
      "SELECT repair_requests_id FROM repair_request WHERE repair_requests_id = ?",
      [requestId],
    );

    if (requestRows.length === 0) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    // Check if technician exists and is active
    const [techRows] = await dbPool.query(
      `SELECT s.staff_id FROM staff s
       INNER JOIN staff_type st ON s.staff_type_id = st.staff_type_id
       WHERE s.staff_id = ? AND st.staff_type_name = 'technician' AND s.is_active = TRUE`,
      [technicianId],
    );

    if (techRows.length === 0) {
      return res.status(404).json({
        message: "Technician not found or is not active.",
      });
    }

    // Update technician
    const query = `UPDATE repair_request SET technician_id = ? WHERE repair_requests_id = ?`;
    await dbPool.query(query, [technicianId, requestId]);

    return res.status(200).json({
      success: true,
      message: "Technician updated successfully.",
    });
  } catch (error) {
    console.error("Error updating repair technician:", error);
    return res.status(500).json({
      message: "Failed to update technician. Please try again later.",
    });
  }
};

/**
 * PUT /api/admin/repairs/records/:repairId/cancel
 * Cancel a repair by updating its status
 */
export const cancelRepair = async (req, res) => {
  try {
    const { repairId } = req.params;

    // Check if repair exists
    const [repairRows] = await dbPool.query(
      "SELECT repair_id, repair_requests_id FROM repair WHERE repair_id = ?",
      [repairId],
    );

    if (repairRows.length === 0) {
      return res.status(404).json({
        message: "Repair not found.",
      });
    }

    // Update repair status to 'cancelled'
    const query = `UPDATE repair SET status = 'cancelled' WHERE repair_id = ?`;
    await dbPool.query(query, [repairId]);

    // Update repair request status to 'rejected'
    const updateRequestQuery = `UPDATE repair_request SET status = 'rejected' WHERE repair_requests_id = ?`;
    await dbPool.query(updateRequestQuery, [repairRows[0].repair_requests_id]);

    return res.status(200).json({
      success: true,
      message: "Repair cancelled successfully.",
    });
  } catch (error) {
    console.error("Error cancelling repair:", error);
    return res.status(500).json({
      message: "Failed to cancel repair. Please try again later.",
    });
  }
};

/**
 * PUT /api/admin/repairs/:requestId/reject
 * Reject a repair request (status -> rejected)
 */
export const rejectRepairRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Check if repair request exists
    const [requestRows] = await dbPool.query(
      "SELECT repair_requests_id, status FROM repair_request WHERE repair_requests_id = ?",
      [requestId],
    );

    if (requestRows.length === 0) {
      return res.status(404).json({
        message: "Repair request not found.",
      });
    }

    if (requestRows[0].status === "rejected") {
      return res.status(200).json({
        success: true,
        message: "Repair request already rejected.",
      });
    }

    // Update status to rejected
    const query = `UPDATE repair_request SET status = 'rejected' WHERE repair_requests_id = ?`;
    await dbPool.query(query, [requestId]);

    return res.status(200).json({
      success: true,
      message: "Repair request rejected successfully.",
    });
  } catch (error) {
    console.error("Error rejecting repair request:", error);
    return res.status(500).json({
      message: "Failed to reject repair request. Please try again later.",
    });
  }
};
