import dbPool from "../../config/dbConnection.js";

export const getLoyaltyInfo = async (req, res) => {
  const { userId } = req.user;

  try {
    // get loyalty settings
    const [settingsRows] = await dbPool.query(`
                        SELECT setting_name, setting_value FROM loyalty_setting
                        WHERE setting_name IN (
                            'redeem_points_value',
                            'max_redemption_percentage',
                            'min_redeem_threshold'
                        )`);

    // Convert rows to key-value object
    const settings = {};
    for (const row of settingsRows) {
      settings[row.setting_name] = Number(row.setting_value);
    }

    const requiredSettings = [
      "redeem_points_value",
      "max_redemption_percentage",
      "min_redeem_threshold",
    ];

    for (const key of requiredSettings) {
      if (settings[key] === undefined) {
        return res.status(500).json({
          success: false,
          message:
            "Loyalty program settings are misconfigured. Please contact support.",
        });
      }
    }

    // get customer's loyalty points
    const [loyaltyPointsRows] = await dbPool.query(
      "SELECT current_points FROM loyalty_program WHERE customer_id=? LIMIT 1",
      [userId],
    );
    const userCurrentPoints = Number(
      loyaltyPointsRows[0]?.current_points || 0,
    );

    return res.status(200).json({
      success: true,
      data: {
        redeemPointsValue: settings.redeem_points_value,
        maxRedemptionPercentage: settings.max_redemption_percentage,
        minRedeemThreshold: settings.min_redeem_threshold,
        userCurrentPoints,
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
