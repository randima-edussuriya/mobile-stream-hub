import dbPool from "../../config/dbConnection.js";

// Get all repair requests for logged-in customer
export const getMyRepairRequests = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const sql = `
      SELECT 
        rr.repair_requests_id,
        rr.status,
        rr.appointment_date,
        CONCAT(s.first_name, ' ', s.last_name) as technician_name
      FROM repair_request rr
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE rr.customer_id = ?
      ORDER BY rr.appointment_date DESC
    `;

    const [requests] = await dbPool.query(sql, [customerId]);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get repair request details by ID
export const getRepairRequestDetail = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const sql = `
      SELECT 
        rr.repair_requests_id,
        rr.issue_description,
        rr.status,
        rr.device_info,
        rr.appointment_date,
        rr.created_at,
        rr.updated_at,
        rr.technician_id,
        CONCAT(s.first_name, ' ', s.last_name) as technician_name,
        s.email as technician_email,
        s.phone_number as technician_phone
      FROM repair_request rr
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE rr.repair_requests_id = ? AND rr.customer_id = ?
    `;

    const [requests] = await dbPool.query(sql, [requestId, customerId]);

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repair request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: requests[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get all active technician staff
export const getTechnicians = async (req, res) => {
  try {
    const sql = `
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

    const [technicians] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Check technician availability for given date
export const checkTechnicianAvailability = async (req, res) => {
  try {
    const { technicianId, appointmentDate } = req.query;

    if (!technicianId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Technician ID and appointment date are required",
      });
    }

    // Parse the appointment date
    const appointmentDateObj = new Date(appointmentDate);

    /*----------------------------------------------
        Check if the date is a day off
    -----------------------------------------------*/
    let isOnDayOff = false;
    let hasLeave = false;
    const dayOffSql = `
      SELECT COUNT(*) as day_off_count
      FROM day_off
      WHERE ? BETWEEN start_date AND end_date
    `;

    const [dayOffResult] = await dbPool.query(dayOffSql, [appointmentDateObj]);
    if (dayOffResult[0].day_off_count > 0) {
      return res.status(200).json({
        success: true,
        message: "Shop is closed on this date",
        data: {
          isAvailable: false,
        },
      });
    }

    /*----------------------------------------------
        Check if technician has leave on that date
    -----------------------------------------------*/
    const leaveSql = `
      SELECT COUNT(*) as leave_count
      FROM leave_request
      WHERE requested_by = ?
        AND ? BETWEEN start_date AND end_date
        AND status IN ('pending', 'approved')
    `;

    const [leaveResult] = await dbPool.query(leaveSql, [
      technicianId,
      appointmentDateObj,
    ]);

    if (leaveResult[0].leave_count > 0) {
      return res.status(200).json({
        success: true,
        message: "Technician is on leave on this date",
        data: {
          isAvailable: false,
        },
      });
    }

    /*----------------------------------------------
        Check existing appointments for that date
    -----------------------------------------------*/
    const startOfDay = new Date(
      appointmentDateObj.getFullYear(),
      appointmentDateObj.getMonth(),
      appointmentDateObj.getDate(),
      9,
      0,
      0,
    );
    const endOfDay = new Date(
      appointmentDateObj.getFullYear(),
      appointmentDateObj.getMonth(),
      appointmentDateObj.getDate(),
      16,
      59,
      59,
    );

    // 9:00 AM and 04:59 PM are counted
    const appointmentSql = `
      SELECT COUNT(*) as appointment_count
      FROM repair_request
      WHERE technician_id = ? 
        AND appointment_date BETWEEN ? AND ?
        AND status IN ('pending', 'accepted')
    `;

    const [appointmentResult] = await dbPool.query(appointmentSql, [
      technicianId,
      startOfDay,
      endOfDay,
    ]);

    if (appointmentResult[0].appointment_count >= 6) {
      return res.status(200).json({
        success: true,
        message:
          "Technician is not available for this date. Maximum 6 appointments reached.",
        data: {
          isAvailable: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Technician is available for this date. (${6 - appointmentResult[0].appointment_count} slots remaining)`,
      data: {
        isAvailable: true,
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

// Create repair request
export const createRepairRequest = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { technicianId, issueDescription, deviceInfo, appointmentDate } =
      req.body;

    // Validate required fields
    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician is required",
      });
    }

    if (!issueDescription || !issueDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Issue description is required",
      });
    }

    if (!deviceInfo || !deviceInfo.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device information is required",
      });
    }

    if (!appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Appointment date is required",
      });
    }

    // Parse appointment date
    const appointmentDateObj = new Date(appointmentDate);

    // Check if appointment date is in the future
    if (appointmentDateObj < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future",
      });
    }

    // Check if technician exists and is active
    const [technicianRows] = await dbPool.query(
      `SELECT s.staff_id FROM staff s
       INNER JOIN staff_type st ON s.staff_type_id = st.staff_type_id
       WHERE s.staff_id = ? AND st.staff_type_name = 'technician' AND s.is_active = TRUE`,
      [technicianId],
    );

    if (technicianRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Technician not found or is not active",
      });
    }

    // Check availability
    const startOfDay = new Date(
      appointmentDateObj.getFullYear(),
      appointmentDateObj.getMonth(),
      appointmentDateObj.getDate(),
      9,
      0,
      0,
    );
    const endOfDay = new Date(
      appointmentDateObj.getFullYear(),
      appointmentDateObj.getMonth(),
      appointmentDateObj.getDate(),
      16,
      59,
      59,
    );

    const [availabilityResult] = await dbPool.query(
      `SELECT COUNT(*) as appointment_count
       FROM repair_request
       WHERE technician_id = ? 
         AND appointment_date BETWEEN ? AND ?
         AND status IN ('pending', 'accepted')`,
      [technicianId, startOfDay, endOfDay],
    );

    if (availabilityResult[0].appointment_count >= 6) {
      return res.status(400).json({
        success: false,
        message:
          "Technician is not available for this date. Maximum 6 appointments per day.",
      });
    }

    // Create repair request
    const sql = `
      INSERT INTO repair_request 
        (issue_description, device_info, appointment_date, technician_id, customer_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.query(sql, [
      issueDescription.trim(),
      deviceInfo.trim(),
      appointmentDateObj,
      technicianId,
      customerId,
    ]);

    return res.status(201).json({
      success: true,
      message: "Repair request created successfully",
      data: {
        repairRequestId: result.insertId,
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

// Get all repairs for logged-in customer
export const getMyRepairs = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const sql = `
      SELECT 
        r.repair_id,
        r.status,
        r.total_cost,
        r.identified_device,
        rr.appointment_date,
        CONCAT(s.first_name, ' ', s.last_name) as technician_name
      FROM repair r
      INNER JOIN repair_request rr ON r.repair_requests_id = rr.repair_requests_id
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE rr.customer_id = ?
      ORDER BY rr.appointment_date DESC
    `;

    const [repairs] = await dbPool.query(sql, [customerId]);

    return res.status(200).json({
      success: true,
      data: repairs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get repair details by ID
export const getRepairDetail = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const { repairId } = req.params;

    if (!repairId) {
      return res.status(400).json({
        success: false,
        message: "Repair ID is required",
      });
    }

    const sql = `
      SELECT 
        r.repair_id,
        r.status,
        r.total_cost,
        r.identified_issue,
        r.identified_device,
        rr.repair_requests_id,
        rr.issue_description,
        rr.device_info,
        rr.appointment_date,
        rr.created_at,
        rr.updated_at,
        CONCAT(s.first_name, ' ', s.last_name) as technician_name,
        s.email as technician_email,
        s.phone_number as technician_phone
      FROM repair r
      INNER JOIN repair_request rr ON r.repair_requests_id = rr.repair_requests_id
      INNER JOIN staff s ON rr.technician_id = s.staff_id
      WHERE r.repair_id = ? AND rr.customer_id = ?
    `;

    const [repairs] = await dbPool.query(sql, [repairId, customerId]);

    if (repairs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: repairs[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
