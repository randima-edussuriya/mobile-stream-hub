import dbPool from "../../config/dbConnection.js";

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    const sql = `
                SELECT s.staff_id, s.first_name, s.last_name, s.email, s.is_active, s.phone_number, s.hire_date, s.nic_number, s.address, st.staff_type_name
                FROM staff s
                INNER JOIN staff_type st ON st.staff_type_id=s.staff_type_id
                WHERE s.staff_id!=?
                ORDER BY s.staff_id ASC`;
    const [users] = await dbPool.query(sql, [userId]);
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getMeBasicData = async (req, res) => {
  try {
    const { userId, userRole } = req.body;

    const sql = "SELECT first_name, email FROM `staff` WHERE staff_id=?";
    const [user] = await dbPool.query(sql, [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: { name: user[0].first_name, email: user[0].email, userRole },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { staffId, isActive } = req.body;
    const sql = "UPDATE staff SET is_active=? WHERE staff_id=?";
    await dbPool.query(sql, [isActive, staffId]);
    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
