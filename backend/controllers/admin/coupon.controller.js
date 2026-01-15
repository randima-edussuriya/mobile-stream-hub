import dbPool from "../../config/dbConnection.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      userGroup,
    } = req.body;
    const { userId } = req.user;
    const insertSql = `INSERT INTO coupon_code 
                (coupon_code, discount_type, discount_value, expiry_date, usage_limit, user_group, staff_id)
                VALUES (?,?,?,?,?,?,?)`;
    await dbPool.query(insertSql, [
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      userGroup,
      userId,
    ]);
    return res
      .status(201)
      .json({ success: true, message: "Coupon created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
