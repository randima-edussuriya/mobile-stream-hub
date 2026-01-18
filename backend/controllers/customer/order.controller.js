import dbPool from "../../config/dbConnection.js";
import stripe from "stripe";

export const getCustomerOrders = async (req, res) => {};
export const getCustomerOrder = async (req, res) => {};

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
    let couponDiscountValue = 0;
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

      // apply coupon discount
      couponDiscountValue = Number(coupon.discount_value);

      // apply coupon free shipping if applicable
      if (coupon.discount_type === "free shipping") {
        shippingCost = 0;
      }
    }

    /*----------------------------------------------------
          finalize order total
    ------------------------------------------------------ */
    const orderTotal = cartItemTotal + shippingCost - couponDiscountValue;

    /*----------------------------------------------------------
          insert order, order items, shipping details records
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
                        (contact_name, street_address, province, city, zip_code, phone_number, order_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await dbPool.query(insertShippingSql, [
      contactName,
      streetAddress,
      province,
      city,
      zipCode,
      phoneNumber,
      orderId,
    ]);

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

      const line_items = cartItems.map((item) => {
        const itemDiscountedPrice =
          Number(item.sell_price) -
          (Number(item.sell_price) * Number(item.discount)) / 100;
        return {
          price_data: {
            currency: "lkr",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(itemDiscountedPrice * 100), // in cents
          },
          quantity: item.item_quantity,
        };
      });

      // create coupon in stripe if applicable
      let coupon = null;
      if (couponCode && couponDiscountValue > 0) {
        coupon = await stripeInstance.coupons.create({
          amount_off: Math.round(couponDiscountValue * 100), // in cents
          currency: "lkr",
          duration: "once",
        });
      }
      // create session
      const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        discounts: coupon ? [{ coupon: coupon.id }] : [],
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

    res.status(200).json({
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
