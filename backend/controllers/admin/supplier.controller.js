import dbPool from "../../config/dbConnection.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const [suppliers] = await dbPool.query(`
      SELECT 
        s.supplier_id,
        s.name,
        s.email,
        s.phone_number,
        s.address,
        COUNT(i.item_id) AS item_count
      FROM supplier s
      LEFT JOIN item i ON s.supplier_id = i.supplier_id
      GROUP BY s.supplier_id, s.name, s.email, s.phone_number, s.address
      ORDER BY s.supplier_id
    `);
    return res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getSupplierById = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const [supplierRows] = await dbPool.query(
      `
        SELECT 
          s.supplier_id,
          s.name,
          s.email,
          s.phone_number,
          s.address,
          COUNT(i.item_id) AS item_count
        FROM supplier s
        LEFT JOIN item i ON s.supplier_id = i.supplier_id
        WHERE s.supplier_id = ?
        GROUP BY s.supplier_id
      `,
      [supplierId],
    );

    if (supplierRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    const [items] = await dbPool.query(
      `
        SELECT 
          item_id,
          name,
          brand,
          stock_quantity,
          sell_price,
          cost_price,
          discount
        FROM item
        WHERE supplier_id = ?
        ORDER BY item_id
      `,
      [supplierId],
    );

    return res.status(200).json({
      success: true,
      data: {
        supplier: supplierRows[0],
        items,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
