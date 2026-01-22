import dbPool from "../../config/dbConnection.js";

export const getAreaAssigned = async (req, res) => {
  try {
    const { userId } = req.user;

    const sql = "SELECT deliver_area_name FROM deliver_area WHERE staff_id=?";
    const [rows] = await dbPool.query(sql, [userId]);

    return res.status(200).json({
      success: true,
      data: rows.map((r) => r.deliver_area_name),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get all delivery areas with staff details
export const getDeliveryAreas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        da.deliver_area_id,
        da.deliver_area_name,
        da.cost,
        da.staff_id,
        CONCAT(s.first_name, ' ', s.last_name) as staff_name
      FROM deliver_area da
      LEFT JOIN staff s ON da.staff_id = s.staff_id
      ORDER BY da.deliver_area_name ASC
    `;

    const [areas] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: areas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Update delivery area cost
export const updateDeliveryAreaCost = async (req, res) => {
  try {
    const { areaId } = req.params;
    const { cost } = req.body;

    if (!areaId) {
      return res.status(400).json({
        success: false,
        message: "Area ID is required",
      });
    }

    if (!cost || isNaN(cost) || parseFloat(cost) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid cost is required",
      });
    }

    // Check if area exists
    const [areaRows] = await dbPool.query(
      "SELECT deliver_area_id FROM deliver_area WHERE deliver_area_id = ?",
      [areaId],
    );

    if (areaRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery area not found",
      });
    }

    // Update cost
    await dbPool.query(
      "UPDATE deliver_area SET cost = ? WHERE deliver_area_id = ?",
      [parseFloat(cost), areaId],
    );

    return res.status(200).json({
      success: true,
      message: "Delivery area cost updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get all deliver person staff with their assigned areas
export const getDeliverPersons = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.staff_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone_number,
        s.is_active,
        GROUP_CONCAT(da.deliver_area_name ORDER BY da.deliver_area_name SEPARATOR ', ') as assigned_areas
      FROM staff s
      INNER JOIN staff_type st ON s.staff_type_id = st.staff_type_id
      LEFT JOIN deliver_area da ON s.staff_id = da.staff_id
      WHERE st.staff_type_name = 'deliver person'
      GROUP BY s.staff_id
      ORDER BY s.first_name ASC
    `;

    const [staff] = await dbPool.query(sql);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Update staff's assigned delivery area
export const updateStaffDeliveryArea = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { areaId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    if (!areaId) {
      return res.status(400).json({
        success: false,
        message: "Area ID is required",
      });
    }

    // Check if staff exists and is a deliver person
    const [staffRows] = await dbPool.query(
      `SELECT s.staff_id 
       FROM staff s
       INNER JOIN staff_type st ON s.staff_type_id = st.staff_type_id
       WHERE s.staff_id = ? AND st.staff_type_name = 'deliver person'`,
      [staffId],
    );

    if (staffRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Deliver person not found",
      });
    }

    // Check if area exists
    const [areaRows] = await dbPool.query(
      "SELECT deliver_area_id FROM deliver_area WHERE deliver_area_id = ?",
      [areaId],
    );

    if (areaRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery area not found",
      });
    }

    // Update the staff_id for this area
    await dbPool.query(
      "UPDATE deliver_area SET staff_id = ? WHERE deliver_area_id = ?",
      [staffId, areaId],
    );

    return res.status(200).json({
      success: true,
      message: "Delivery area assigned successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
