import dbPool from "../../config/dbConnection.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req.user;

    const selectSql =
      "SELECT * FROM coupon_code WHERE coupon_code=? AND is_active=TRUE LIMIT 1";
    const [rows] = await dbPool.query(selectSql, [code]);

    // check coupon exists
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon code not found or inactive" });
    }

    const coupon = rows[0];

    // check coupon expiry
    if (new Date(coupon.expiry_date) < new Date()) {
      return res
        .status(410)
        .json({ success: false, message: "Coupon code has expired" });
    }

    // check usage limit
    if (coupon.used_count >= coupon.usage_limit) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code usage limit reached" });
    }

    // chech if user used the coupon before
    const usageCheckSql =
      "SELECT 1 FROM coupon_usage WHERE coupon_code_id=? AND customer_id=? LIMIT 1";
    const [usageRows] = await dbPool.query(usageCheckSql, [
      coupon.coupon_code_id,
      userId,
    ]);
    if (usageRows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "You have already used this coupon" });
    }

    // check user group eligibility
    if (coupon.user_group !== "all") {
      const selectUserBadgeSql =
        "SELECT badge FROM loyalty_program WHERE customer_id=? LIMIT 1";
      const [badgeRows] = await dbPool.query(selectUserBadgeSql, [userId]);
      const userBadge = badgeRows.length > 0 ? badgeRows[0].badge : "none";
      if (userBadge !== coupon.user_group) {
        return res.status(400).json({
          success: false,
          message: `Coupon code is only valid for ${coupon.user_group} members`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        discountValue: coupon.discount_value,
        freeShipping: coupon.discount_type === "free shipping" ? true : false,
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
