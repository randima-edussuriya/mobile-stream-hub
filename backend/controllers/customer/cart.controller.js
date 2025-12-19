import dbPool from "../../config/dbConnection.js";

export const addToCart = async (req, res) => {
  try {
    let { itemId, quantity = 1 } = req.body;
    let customerId = req.user.userId;

    // validation
    if (!itemId || isNaN(Number(itemId)) || Number(itemId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid item id",
      });
    }

    if (!customerId || isNaN(Number(customerId)) || Number(customerId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer id",
      });
    }

    if (
      quantity === undefined ||
      isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    itemId = Number(itemId);
    customerId = Number(customerId);
    quantity = Number(quantity);

    // 2️Check item exists
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
