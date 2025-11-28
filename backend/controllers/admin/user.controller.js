import dbPool from "../../config/dbConnection.js";

export const getAllUsers = async (req, res) => {};

export const getMeBasicData = async (req, res) => {
  try {
    const { userId, role } = req.body;

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
      data: { name: user[0].first_name, email: user[0].email, role },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
