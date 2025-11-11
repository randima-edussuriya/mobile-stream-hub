import db from "../config/dbConnection.js";

export const getStaffUsers = async (req, res) => {
  try {
    const sql = `SELECT s.staff_id, s.first_name, s.last_name, s.email, s.is_active, s.phone_number, s.hire_date, s.nic_number, s.address, st.staff_type_name
                    FROM staff s
                    INNER JOIN staff_type st ON st.staff_type_id=s.staff_type_id`;
    const result = await db.query(sql);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Failed to fetch staff users. Please try again.",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const staffUserId = req.params.id?.trim();
    const { newStatus } = req.body;

    //validate inputs
    if (!staffUserId || isNaN(staffUserId))
      return res.json({
        success: false,
        message: "Missing or invalid staff user ID",
      });
    if (isNaN(newStatus) || ![0, 1].includes(newStatus))
      return res.json({ success: false, message: "Invalid status" });

    //update db
    const sql = "UPDATE staff SET is_active = ? WHERE staff_id = ?";
    await db.query(sql, [newStatus, staffUserId]);
    return res.json({
      success: true,
      message: `Staff user is ${
        newStatus ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed to update staff user status. Please try again.",
    });
  }
};
