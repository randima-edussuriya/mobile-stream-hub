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
