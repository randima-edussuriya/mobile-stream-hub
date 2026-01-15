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

    // check if coupon code already exists
    const checkSql = "SELECT 1 FROM coupon_code WHERE coupon_code=? LIMIT 1";
    const [existingRows] = await dbPool.query(checkSql, [code]);
    if (existingRows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Coupon code already exists" });
    }

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
