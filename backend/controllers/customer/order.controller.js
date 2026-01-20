import dbPool from "../../config/dbConnection.js";
import stripe from "stripe";

// Get all orders for a customer
export const getCustomerOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    const sql =
      "SELECT * FROM order_table WHERE customer_id=? ORDER BY order_date DESC";

    const [orders] = await dbPool.query(sql, [userId]);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get single order by ID
export const getCustomerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Get order details
    const orderSql = `
      SELECT ot.*, d.*, p.payment_date as payment_date, p.status as payment_status
      FROM order_table ot
      INNER JOIN delivering d ON d.order_id=ot.order_id
      INNER JOIN payment p ON p.order_id=ot.order_id
      WHERE ot.order_id=? LIMIT 1;
    `;

    const [orderRows] = await dbPool.query(orderSql, [orderId]);

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderRows[0];

    // Get order items
    const itemsSql = `
      SELECT i.item_id, i.name, oi.item_price, oi.item_quantity, oi.discount
      FROM order_item oi
      INNER JOIN item i ON oi.item_id=i.item_id
      WHERE oi.order_id=?;
    `;

    const [items] = await dbPool.query(itemsSql, [orderId]);

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const cancelCustomerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const { userId } = req.user;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const [orderRows] = await dbPool.query(
      "SELECT status, payment_method FROM order_table WHERE order_id = ? LIMIT 1",
      [orderId],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderRows[0];

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    if (order.payment_method === "online") {
      return res.status(400).json({
        success: false,
        message: "Online payment orders cannot be cancelled here",
      });
    }

    //  Insert cancellation record
    await dbPool.query(
      `INSERT INTO cancellation (reason, status, user_type, order_id, customer_id)
         VALUES (?, 'cancelled', 'customer', ?, ?)`,
      [reason.trim(), orderId, userId],
    );

    // Update order status to cancelled
    await dbPool.query(
      "UPDATE order_table SET status = 'cancelled' WHERE order_id = ?",
      [orderId],
    );

    // Get order items to restore stock
    const [orderItemsRows] = await dbPool.query(
      "SELECT item_id, item_quantity FROM order_item WHERE order_id = ?",
      [orderId],
    );

    // Restore stock for each item
    for (const item of orderItemsRows) {
      await dbPool.query(
        "UPDATE item SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
        [item.item_quantity, item.item_id],
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock restored",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const {
      contactName,
      phoneNumber,
      streetAddress,
      city,
      province,
      district,
      zipCode,
      couponCode,
      paymentMethod,
    } = req.body;
    const { userId, email } = req.user;
    const { origin } = req.headers;

    /*----------------------------------------------------
          get user cart items and total calculation
    ------------------------------------------------------ */
    const cartItemsQuery = `SELECT ci.cart_item_id, ci.item_quantity, ci.item_id, i.name, i.sell_price, i.discount 
                        FROM cart_item ci
                        INNER JOIN item i ON ci.item_id=i.item_id
                        WHERE ci.customer_id=?`;
    const [cartItems] = await dbPool.query(cartItemsQuery, [userId]);
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot place order.",
      });
    }

    // calculate cart item total
    const cartItemTotal = cartItems.reduce((total, item) => {
      return (
        total +
        (Number(item.sell_price) -
          (Number(item.sell_price) * Number(item.discount)) / 100) *
          Number(item.item_quantity)
      );
    }, 0);

    /*----------------------------------------------------
          calculate shipping cost based on district
    ------------------------------------------------------ */
    const shippingCostQuery =
      "SELECT cost as shipping_cost FROM deliver_area WHERE deliver_area_name = ?";
    const [shippingCostRows] = await dbPool.query(shippingCostQuery, [
      district,
    ]);
    let shippingCost =
      shippingCostRows.length > 0
        ? Number(shippingCostRows[0].shipping_cost)
        : 0;

    /*----------------------------------------------------
          apply coupon if available
    ------------------------------------------------------ */
    const couponApplied = {
      success: false,
      discountValue: 0,
      couponId: null,
    };
    if (couponCode) {
      const couponQuery =
        "SELECT * FROM coupon_code WHERE coupon_code=? AND is_active=TRUE LIMIT 1";
      const [couponRows] = await dbPool.query(couponQuery, [couponCode]);

      // check coupon exists
      if (couponRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Coupon code not found or inactive",
        });
      }

      const coupon = couponRows[0];

      // check coupon code
      if (coupon.coupon_code !== couponCode) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon code not match" });
      }

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
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
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

      couponApplied.success = true;
      couponApplied.couponId = coupon.coupon_code_id;

      // apply coupon discount
      couponApplied.discountValue = Number(coupon.discount_value);

      // apply coupon free shipping if applicable
      if (coupon.discount_type === "free shipping") {
        shippingCost = 0;
      }
    }

    /*----------------------------------------------------
          Apply loyalty Program
    ------------------------------------------------------ */
    // get loyalty settings
    const [loyaltySettingsRows] = await dbPool.query(`
                        SELECT setting_name, setting_value FROM loyalty_setting
                        WHERE setting_name IN (
                            'earning_points_ratio',
                            'redeem_points_value',
                            'max_redemption_percentage',
                            'min_redeem_threshold',
                            'silver_points_threshold',
                            'gold_points_threshold',
                            'platinum_points_threshold'
                        )`);

    // create settings object
    const loyaltySettings = {};
    for (const row of loyaltySettingsRows) {
      loyaltySettings[row.setting_name] = Number(row.setting_value);
    }

    const requiredSettings = [
      "earning_points_ratio",
      "redeem_points_value",
      "max_redemption_percentage",
      "min_redeem_threshold",
      "silver_points_threshold",
      "gold_points_threshold",
      "platinum_points_threshold",
    ];

    // validate if all required settings are present
    for (const key of requiredSettings) {
      if (loyaltySettings[key] === undefined) {
        return res.status(500).json({
          success: false,
          message:
            "Loyalty program settings are misconfigured. Please contact support.",
        });
      }
    }

    // get customer's loyalty points
    const [loyaltyPointsRows] = await dbPool.query(
      "SELECT total_points, current_points FROM loyalty_program WHERE customer_id=? LIMIT 1",
      [userId],
    );
    const userLoyaltyInfo = {
      totalPoints: Number(loyaltyPointsRows[0]?.total_points || 0),
      currentPoints: Number(loyaltyPointsRows[0]?.current_points || 0),
    };

    // calculate loyalty discount if applicable
    let pointsToRedeem = 0;
    let loyaltyDiscountAmount = 0;
    if (
      userLoyaltyInfo.currentPoints > 0 &&
      userLoyaltyInfo.currentPoints >= loyaltySettings.min_redeem_threshold
    ) {
      const maxRedeemableAmount =
        (cartItemTotal * loyaltySettings.max_redemption_percentage) / 100;
      const maxRedeemablePoints =
        maxRedeemableAmount / loyaltySettings.redeem_points_value;
      pointsToRedeem =
        Math.min(
          userLoyaltyInfo.currentPoints,
          Math.floor(maxRedeemablePoints),
        ) || 0;
      loyaltyDiscountAmount =
        pointsToRedeem * loyaltySettings.redeem_points_value || 0;
    }

    /*----------------------------------------------------
          finalize order total
    ------------------------------------------------------ */
    const orderTotal =
      cartItemTotal +
      shippingCost -
      couponApplied.discountValue -
      loyaltyDiscountAmount;

    /*----------------------------------------------------------
          insert order related records in the database
    ------------------------------------------------------------ */
    const insertOrderSql =
      "INSERT INTO order_table (total, payment_method, customer_id) VALUES (?, ?, ?)";
    const [orderResult] = await dbPool.query(insertOrderSql, [
      orderTotal,
      paymentMethod,
      userId,
    ]);
    const orderId = orderResult.insertId;

    // insert order items records
    const insertOrderItemSql =
      "INSERT INTO order_item (item_quantity, item_price, discount, item_id, order_id) VALUES (?, ?, ?, ?, ?)";
    for (const item of cartItems) {
      await dbPool.query(insertOrderItemSql, [
        item.item_quantity,
        Number(item.sell_price),
        Number(item.discount),
        item.item_id,
        orderId,
      ]);
    }

    // insert shipping details
    const insertShippingSql = `INSERT INTO delivering 
                        (contact_name, street_address, province, district, city, zip_code, phone_number, order_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await dbPool.query(insertShippingSql, [
      contactName,
      streetAddress,
      province,
      district,
      city,
      zipCode,
      phoneNumber,
      orderId,
    ]);

    // insert payment record with pending status
    const insertPaymentSql =
      "INSERT INTO payment (amount, service_type, order_id) VALUES (?, 'order', ?);";
    await dbPool.query(insertPaymentSql, [orderTotal, orderId]);

    /*----------------------------------------------------------
          insert coupon related records in the database
    ------------------------------------------------------------ */
    // handle coupon usage record and update used count if coupon applied
    if (couponApplied.success) {
      const insertUsageSql =
        "INSERT INTO coupon_usage (coupon_code_id, order_id, customer_id) VALUES (?, ?, ?)";
      await dbPool.query(insertUsageSql, [
        couponApplied.couponId,
        orderId,
        userId,
      ]);

      // update coupon used count
      const updateCouponSql =
        "UPDATE coupon_code SET used_count = used_count + 1 WHERE coupon_code_id=?";
      await dbPool.query(updateCouponSql, [couponApplied.couponId]);
    }

    /*----------------------------------------------------------
          insert loyalty related records in the database
    ------------------------------------------------------------ */
    // deduct loyalty points if applicable
    if (pointsToRedeem > 0) {
      const updateLoyaltySql = `
                          UPDATE loyalty_program SET
                          points_redeemed=points_redeemed+?,
                          current_points=current_points-?
                          WHERE customer_id=?`;
      await dbPool.query(updateLoyaltySql, [
        pointsToRedeem,
        pointsToRedeem,
        userId,
      ]);
    }

    // insert earned loyalty points if applicable
    const pointsEarned =
      Math.floor(orderTotal / loyaltySettings.earning_points_ratio) || 0;
    if (pointsEarned > 0) {
      const userNewTotalPoints = userLoyaltyInfo.totalPoints + pointsEarned;
      // determine badge
      let newBadge = null;
      if (
        userNewTotalPoints >= loyaltySettings.platinum_points_threshold ||
        pointsEarned >= loyaltySettings.platinum_points_threshold
      ) {
        newBadge = "platinum";
      } else if (
        userNewTotalPoints >= loyaltySettings.gold_points_threshold ||
        pointsEarned >= loyaltySettings.gold_points_threshold
      ) {
        newBadge = "gold";
      } else if (
        userNewTotalPoints >= loyaltySettings.silver_points_threshold ||
        pointsEarned >= loyaltySettings.silver_points_threshold
      ) {
        newBadge = "silver";
      }

      if (userLoyaltyInfo.totalPoints === 0) {
        // insert new loyalty program record
        const insertLoyaltySql = `
                      INSERT INTO loyalty_program (total_points, current_points, customer_id) 
                      VALUES (?, ?, ?)`;
        await dbPool.query(insertLoyaltySql, [
          pointsEarned,
          pointsEarned,
          userId,
        ]);
      } else {
        // update existing loyalty program record
        const updateLoyaltySql = `
                          UPDATE loyalty_program SET
                          total_points=?, 
                          current_points=current_points+?,
                          badge=?
                          WHERE customer_id=?`;
        await dbPool.query(updateLoyaltySql, [
          userNewTotalPoints,
          pointsEarned,
          newBadge,
          userId,
        ]);
      }
    }

    /*----------------------------------------------------
          clear user cart
    ------------------------------------------------------ */
    const clearCartSql = "DELETE FROM cart_item WHERE customer_id=?";
    await dbPool.query(clearCartSql, [userId]);

    /*----------------------------------------------------
          handle payment method cod, pickup
    ------------------------------------------------------ */
    if (paymentMethod === "cod" || paymentMethod === "pickup") {
      return res.status(201).json({
        success: true,
        message: "Order placed successfully.",
        isPaymentRequired: false,
        url: null,
      });
    }

    /*----------------------------------------------------
          handle payment method online
    ------------------------------------------------------ */
    if (paymentMethod === "online") {
      const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

      const line_items = [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `User Order #${orderId}`,
            },
            unit_amount: Math.round((orderTotal - shippingCost) * 100), // in cents
          },
          quantity: 1,
        },
      ];

      // create session
      const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: shippingCost > 0 ? Math.round(shippingCost * 100) : 0,
                currency: "lkr",
              },
              display_name:
                shippingCost > 0 ? "Standard Delivery" : "Free Shipping",
            },
          },
        ],
        customer_email: email,
        success_url: `${origin}/my-orders`,
        cancel_url: `${origin}/checkout`,
        metadata: {
          orderId,
          userId,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Order created. Redirect to payment.",
        isPaymentRequired: true,
        url: session.url,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get delivery cost by area name
export const getDeliveryCost = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).json({
        success: false,
        message: "Delivery district is required",
      });
    }

    const sql =
      "SELECT cost as shipping_cost FROM deliver_area WHERE deliver_area_name = ?";
    const [rows] = await dbPool.query(sql, [district]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Delivery area not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
