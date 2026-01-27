import dbPool from "../../config/dbConnection.js";

/* -----------------------------------------------------------------
      Get all coupons
--------------------------------------------------------------------*/
export const getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await dbPool.query(`
      SELECT 
        c.coupon_code_id,
        c.coupon_code,
        c.discount_type,
        c.discount_value,
        c.expiry_date,
        c.usage_limit,
        c.used_count,
        c.is_active
      FROM coupon_code c
      INNER JOIN staff s ON c.staff_id = s.staff_id
      ORDER BY c.expiry_date DESC
    `);
    return res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* -----------------------------------------------------------------
      Get coupon by ID
--------------------------------------------------------------------*/
export const getCouponById = async (req, res) => {
  const { couponId } = req.params;

  try {
    const [couponRows] = await dbPool.query(
      `
      SELECT 
        c.coupon_code_id,
        c.coupon_code,
        c.discount_type,
        c.discount_value,
        c.expiry_date,
        c.usage_limit,
        c.used_count,
        c.user_group,
        c.is_active,
        c.created_at,
        c.staff_id,
        CONCAT(s.first_name, ' ', s.last_name) AS created_by_name
      FROM coupon_code c
      JOIN staff s ON c.staff_id = s.staff_id
      WHERE c.coupon_code_id = ?
    `,
      [couponId],
    );

    if (couponRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: couponRows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* -----------------------------------------------------------------
      Get coupon usage
--------------------------------------------------------------------*/
export const getCouponUsage = async (req, res) => {
  const { couponId } = req.params;

  try {
    const [usageRecords] = await dbPool.query(
      `
      SELECT 
        cu.usage_id,
        cu.usage_date,
        cu.order_id,
        cu.customer_id
      FROM coupon_usage cu
      WHERE cu.coupon_code_id = ?
      ORDER BY cu.usage_date DESC
    `,
      [couponId],
    );

    return res.status(200).json({
      success: true,
      data: usageRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* -----------------------------------------------------------------
      Create coupon
--------------------------------------------------------------------*/
export const createCoupon = async (req, res) => {
  try {
    const {
      coupon_code,
      discount_type,
      discount_value,
      expiry_date,
      usage_limit,
      user_group,
    } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!coupon_code || !discount_type || !expiry_date || !user_group) {
      return res.status(400).json({
        success: false,
        message:
          "coupon_code, discount_type, expiry_date, and user_group are required",
      });
    }

    // check if coupon code already exists
    const checkSql = "SELECT 1 FROM coupon_code WHERE coupon_code = ? LIMIT 1";
    const [existingRows] = await dbPool.query(checkSql, [coupon_code]);
    if (existingRows.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Coupon code already exists" });
    }

    const insertSql = `INSERT INTO coupon_code 
                (coupon_code, discount_type, discount_value, expiry_date, usage_limit, user_group, staff_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await dbPool.query(insertSql, [
      coupon_code,
      discount_type,
      discount_value,
      expiry_date,
      usage_limit,
      user_group,
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

/* -----------------------------------------------------------------
      Update coupon
--------------------------------------------------------------------*/
export const updateCoupon = async (req, res) => {
  const { couponId } = req.params;
  const {
    discount_type,
    discount_value,
    expiry_date,
    usage_limit,
    user_group,
    is_active,
  } = req.body;

  try {
    // Validate required fields
    if (!discount_type || !expiry_date || !user_group) {
      return res.status(400).json({
        success: false,
        message: "discount_type, expiry_date, and user_group are required",
      });
    }

    // Check if coupon exists
    const [couponExists] = await dbPool.query(
      "SELECT coupon_code_id FROM coupon_code WHERE coupon_code_id = ?",
      [couponId],
    );

    if (couponExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Update coupon
    await dbPool.query(
      `
      UPDATE coupon_code
      SET discount_type = ?, 
          discount_value = ?, 
          expiry_date = ?, 
          usage_limit = ?, 
          user_group = ?,
          is_active = ?
      WHERE coupon_code_id = ?
    `,
      [
        discount_type,
        discount_value,
        expiry_date,
        usage_limit,
        user_group,
        is_active,
        couponId,
      ],
    );

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* -----------------------------------------------------------------
      Delete coupon
--------------------------------------------------------------------*/
export const deleteCoupon = async (req, res) => {
  const { couponId } = req.params;

  try {
    // Check if coupon exists
    const [couponExists] = await dbPool.query(
      "SELECT coupon_code_id FROM coupon_code WHERE coupon_code_id = ?",
      [couponId],
    );

    if (couponExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Delete coupon
    await dbPool.query("DELETE FROM coupon_code WHERE coupon_code_id = ?", [
      couponId,
    ]);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
