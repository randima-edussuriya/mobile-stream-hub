import dbPool from "../../config/dbConnection.js";

export const getLoyaltySettings = async (req, res) => {
  try {
    const sql = "SELECT * FROM loyalty_setting ORDER BY loyalty_setting_id ASC";
    const [settings] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateLoyaltySetting = async (req, res) => {
  try {
    const { loyaltySettingId, settingValue } = req.body;
    const { userId } = req.user;

    // check if setting exists
    const sqlCheck = "SELECT 1 FROM loyalty_setting WHERE loyalty_setting_id=?";
    const [rows] = await dbPool.query(sqlCheck, [loyaltySettingId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Loyalty setting not found",
      });
    }

    const sql =
      "UPDATE loyalty_setting SET setting_value=?, updated_by=? WHERE loyalty_setting_id=?";
    await dbPool.query(sql, [settingValue, userId, loyaltySettingId]);

    return res.status(200).json({
      success: true,
      message: "Loyalty setting updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getLoyaltyPrograms = async (req, res) => {
  try {
    const sql = `
      SELECT 
        lp.loyalty_id,
        lp.total_points,
        lp.points_redeemed,
        lp.current_points,
        lp.badge,
        lp.updated_at,
        lp.customer_id
      FROM loyalty_program lp
      ORDER BY lp.loyalty_id DESC
    `;
    const [programs] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
