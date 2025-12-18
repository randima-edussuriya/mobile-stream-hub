import dbPool from "../../config/dbConnection.js";

export const getCustomerAllItems = async (req, res) => {
  const { categoryId, search, sortBy = "created_at DESC" } = req.query;

  const filters = [];
  const values = [];

  // filter by category
  if (categoryId) {
    filters.push("category_id = ?");
    values.push(Number(categoryId));
  }

  //filter by search
  if (search) {
    filters.push("name LIKE ?");
    values.push(`%${search}%`);
  }

  // construct where clause
  const whereFields = filters.length > 0 ? `${filters.join(" AND ")}` : "";

  // construct order by clause
  const allowedSortFields = [
    "sell_price DESC",
    "sell_price ASC",
    "created_at DESC",
    "created_at ASC",
    "name DESC",
    "name ASC",
  ];
  const orderByFields = allowedSortFields.includes(sortBy)
    ? sortBy
    : "created_at DESC";

  const sql = `
                SELECT i.* FROM item i
                INNER JOIN category c ON c.category_id = i.category_id
                WHERE ${whereFields} c.category_type !='repair part'
                ORDER BY ${orderByFields}`;
  try {
    const [items] = await dbPool.query(sql, values);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const [item] = await dbPool.query("SELECT * FROM item WHERE item_id = ?", [
      itemId,
    ]);
    // check if item exists
    if (item.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.status(200).json({ success: true, data: item[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
