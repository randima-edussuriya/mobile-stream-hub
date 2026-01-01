import dbPool from "../../config/dbConnection.js";

export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const customerId = req.user.userId;

    // Check item exists
    const [itemRows] = await dbPool.query(
      "SELECT stock_quantity FROM item WHERE item_id = ?",
      [itemId]
    );

    if (itemRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check stock availability
    if (itemRows[0].stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    // Check existing cart item
    const [cartRows] = await dbPool.query(
      "SELECT cart_item_id, item_quantity FROM cart_item WHERE item_id = ? AND customer_id = ?",
      [itemId, customerId]
    );

    // Update quantity if exists
    if (cartRows.length > 0) {
      const newQuantity = cartRows[0].item_quantity + quantity;

      await dbPool.query(
        "UPDATE cart_item SET item_quantity = ? WHERE cart_item_id = ?",
        [newQuantity, cartRows[0].cart_item_id]
      );

      // change item stock quantity
      const newStockQuantity = itemRows[0].stock_quantity - quantity;
      await dbPool.query(
        "UPDATE item SET stock_quantity = ? WHERE item_id = ?",
        [newStockQuantity, itemId]
      );

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
      });
    }

    // Insert new cart item
    await dbPool.query(
      "INSERT INTO cart_item (item_quantity, item_id, customer_id) VALUES (?, ?, ?)",
      [quantity, itemId, customerId]
    );

    // change item stock quantity
    const newStockQuantity = itemRows[0].stock_quantity - quantity;
    await dbPool.query("UPDATE item SET stock_quantity = ? WHERE item_id = ?", [
      newStockQuantity,
      itemId,
    ]);

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const sqlQuery = `
                SELECT ci.cart_item_id, ci.item_quantity, ci.item_id, i.image, i.name, i.sell_price, i.discount, i.stock_quantity
                FROM cart_item ci
                INNER JOIN item i ON i.item_id=ci.item_id
                WHERE ci.customer_id=?`;
    const [cartItems] = await dbPool.query(sqlQuery, [customerId]);

    return res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    // check cart item exists
    const selectSql =
      "SELECT item_quantity, item_id FROM cart_item WHERE cart_item_id=? LIMIT 1";
    const [cartItemRow] = await dbPool.query(selectSql, [cartItemId]);
    if (cartItemRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // delete cart item
    const deleteSql = "DELETE FROM cart_item WHERE cart_item_id=?";
    await dbPool.query(deleteSql, [cartItemId]);

    // restore item stock quantity
    const updateSql =
      "UPDATE item SET stock_quantity=stock_quantity+? WHERE item_id=?";
    await dbPool.query(updateSql, [
      cartItemRow[0].item_quantity,
      cartItemRow[0].item_id,
    ]);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const customerId = req.user.userId;

    for (const { cartItemId, newQuantity } of cartItems) {
      // get existing cart item
      const [cartRow] = await dbPool.query(
        "SELECT item_quantity, item_id FROM cart_item WHERE cart_item_id = ? AND customer_id = ? LIMIT 1",
        [cartItemId, customerId]
      );
      if (cartRow.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Cart item with ID ${cartItemId} not found`,
        });
      }
      const existingQuantity = cartRow[0].item_quantity;
      const itemId = cartRow[0].item_id;
      // if quantity is same, skip
      if (existingQuantity === newQuantity) continue;

      // get item stock quantity
      const [itemRow] = await dbPool.query(
        "SELECT stock_quantity FROM item WHERE item_id = ? LIMIT 1",
        [itemId]
      );
      if (itemRow.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${itemId} not found`,
        });
      }
      const stockQuantity = itemRow[0].stock_quantity;

      // if new quantity is greater than existing
      if (newQuantity > existingQuantity) {
        const diff = newQuantity - existingQuantity;
        console.log("diff", diff);
        console.log("stockQuantity", stockQuantity);
        if (stockQuantity < diff) {
          return res.status(400).json({
            success: false,
            message: "Out of stock",
          });
        }
        // reduce stock quantity
        await dbPool.query(
          "UPDATE item SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
          [diff, itemId]
        );
      }

      // if new quantity is less than existing
      if (newQuantity < existingQuantity) {
        const diff = existingQuantity - newQuantity;
        // increase stock quantity
        await dbPool.query(
          "UPDATE item SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
          [diff, itemId]
        );
      }

      // update cart item quantity
      await dbPool.query(
        "UPDATE cart_item SET item_quantity = ? WHERE cart_item_id = ?",
        [newQuantity, cartItemId]
      );
    }
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
