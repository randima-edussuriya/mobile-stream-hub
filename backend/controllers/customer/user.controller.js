import dbPool from "../../config/dbConnection.js";

export const getMeBasicData = async (req, res) => {
  try {
    const { userId } = req.user;

    const sql = "SELECT first_name, email FROM customer WHERE customer_id=?";
    const [user] = await dbPool.query(sql, [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: { name: user[0].first_name, email: user[0].email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
