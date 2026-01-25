import dbPool from "../../config/dbConnection.js";

export const getDayOffs = async (req, res) => {
  try {
    const [dayOffs] = await dbPool.query(`
      SELECT 
        d.day_off_id,
        d.reason,
        d.start_date,
        d.end_date,
        d.created_at,
        CONCAT(s.first_name, ' ', s.last_name) AS created_by_name
      FROM day_off d
      INNER JOIN staff s ON d.created_by = s.staff_id
      ORDER BY d.start_date DESC
    `);
    return res.status(200).json({ success: true, data: dayOffs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const addDayOff = async (req, res) => {
  const { reason, start_date, end_date } = req.body;
  const createdBy = req.user?.userId;

  try {
    if (!reason || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields (reason, start_date, end_date) are required",
      });
    }

    if (!createdBy) {
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
      `INSERT INTO day_off (reason, start_date, end_date, created_by) VALUES (?, ?, ?, ?)`,
      [reason, start_date, end_date, createdBy],
    );

    return res
      .status(201)
      .json({ success: true, message: "Day off created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getDayOffById = async (req, res) => {
  const { dayOffId } = req.params;

  try {
    const [dayOffRows] = await dbPool.query(
      `
        SELECT 
          d.day_off_id,
          d.reason,
          d.start_date,
          d.end_date,
          d.created_at,
          d.created_by,
          CONCAT(s.first_name, ' ', s.last_name) AS created_by_name
        FROM day_off d
        JOIN staff s ON d.created_by = s.staff_id
        WHERE d.day_off_id = ?
      `,
      [dayOffId],
    );

    if (dayOffRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Day off record not found" });
    }

    return res.status(200).json({
      success: true,
      data: dayOffRows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateDayOff = async (req, res) => {
  const { dayOffId } = req.params;
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

    // Check if day off exists
    const [dayOffExists] = await dbPool.query(
      "SELECT day_off_id FROM day_off WHERE day_off_id = ?",
      [dayOffId],
    );

    if (dayOffExists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Day off record not found" });
    }

    // Update day off
    await dbPool.query(
      `
        UPDATE day_off
        SET reason = ?, start_date = ?, end_date = ?
        WHERE day_off_id = ?
      `,
      [reason, start_date, end_date, dayOffId],
    );

    // Fetch updated day off
    const [updatedDayOff] = await dbPool.query(
      `
        SELECT 
          d.day_off_id,
          d.reason,
          d.start_date,
          d.end_date,
          d.created_at,
          d.created_by,
          CONCAT(s.first_name, ' ', s.last_name) AS created_by_name
        FROM day_off d
        JOIN staff s ON d.created_by = s.staff_id
        WHERE d.day_off_id = ?
      `,
      [dayOffId],
    );

    return res.status(200).json({
      success: true,
      data: updatedDayOff[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
