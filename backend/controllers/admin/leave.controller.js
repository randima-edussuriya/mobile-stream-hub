import dbPool from "../../config/dbConnection.js";

export const getLeaves = async (req, res) => {
  try {
    const { userId, userRole } = req.user;

    let query = `
      SELECT 
        l.leave_request_id,
        l.reason,
        l.status,
        l.start_date,
        l.end_date,
        l.requested_at,
        CONCAT(s.first_name, ' ', s.last_name) AS requested_by_name
      FROM leave_request l
      INNER JOIN staff s ON l.requested_by = s.staff_id
    `;

    // Filter based on user role
    if (userRole !== "admin") {
      query += ` WHERE l.requested_by = ?`;
    }

    query += ` ORDER BY l.start_date DESC`;

    const params = userRole !== "admin" ? [userId] : [];

    const [leaves] = await dbPool.query(query, params);
    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const addLeave = async (req, res) => {
  const { reason, start_date, end_date } = req.body;
  const requestedBy = req.user?.userId;

  try {
    if (!reason || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields (reason, start_date, end_date) are required",
      });
    }

    if (!requestedBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User information not found",
      });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    await dbPool.query(
      `INSERT INTO leave_request (reason, start_date, end_date, requested_by) VALUES (?, ?, ?, ?)`,
      [reason, start_date, end_date, requestedBy],
    );

    return res
      .status(201)
      .json({ success: true, message: "Leave request created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getLeaveById = async (req, res) => {
  const { leaveId } = req.params;

  try {
    const [leaveRows] = await dbPool.query(
      `
        SELECT 
          l.leave_request_id,
          l.reason,
          l.status,
          l.start_date,
          l.end_date,
          l.requested_at,
          l.responded_at,
          l.requested_by,
          CONCAT(s.first_name, ' ', s.last_name) AS requested_by_name
        FROM leave_request l
        JOIN staff s ON l.requested_by = s.staff_id
        WHERE l.leave_request_id = ?
      `,
      [leaveId],
    );

    if (leaveRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });
    }

    return res.status(200).json({
      success: true,
      data: leaveRows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateLeave = async (req, res) => {
  const { leaveId } = req.params;
  const { reason, start_date, end_date } = req.body;

  try {
    // Validate required fields
    if (!reason || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields (reason, start_date, end_date) are required",
      });
    }

    // Validate dates
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    // Check if leave request exists
    const [leaveExists] = await dbPool.query(
      "SELECT leave_request_id FROM leave_request WHERE leave_request_id = ?",
      [leaveId],
    );

    if (leaveExists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });
    }

    // Update leave request
    await dbPool.query(
      `
        UPDATE leave_request
        SET reason = ?, start_date = ?, end_date = ?
        WHERE leave_request_id = ?
      `,
      [reason, start_date, end_date, leaveId],
    );

    // Fetch updated leave request
    const [updatedLeave] = await dbPool.query(
      `
        SELECT 
          l.leave_request_id,
          l.reason,
          l.status,
          l.start_date,
          l.end_date,
          l.requested_at,
          l.responded_at,
          l.requested_by,
          CONCAT(s.first_name, ' ', s.last_name) AS requested_by_name
        FROM leave_request l
        JOIN staff s ON l.requested_by = s.staff_id
        WHERE l.leave_request_id = ?
      `,
      [leaveId],
    );

    return res.status(200).json({
      success: true,
      data: updatedLeave[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
