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

export const addSupplier = async (req, res) => {
  const { name, email, phone_number, address } = req.body;

  try {
    if (!name || !email || !phone_number || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone_number, address) are required",
      });
    }

    // check valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    await dbPool.query(
      `INSERT INTO supplier (name, email, phone_number, address) VALUES (?, ?, ?, ?)`,
      [name, email, phone_number, address],
    );

    return res
      .status(201)
      .json({ success: true, message: "Supplier added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateSupplier = async (req, res) => {
  const { supplierId } = req.params;
  const { name, email, phone_number, address } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !phone_number || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone_number, address) are required",
      });
    }

    // Check if supplier exists
    const [supplierExists] = await dbPool.query(
      "SELECT supplier_id FROM supplier WHERE supplier_id = ?",
      [supplierId],
    );

    if (supplierExists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    // Update supplier
    await dbPool.query(
      `
        UPDATE supplier
        SET name = ?, email = ?, phone_number = ?, address = ?
        WHERE supplier_id = ?
      `,
      [name, email, phone_number, address, supplierId],
    );

    // Fetch updated supplier
    const [updatedSupplier] = await dbPool.query(
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

    return res.status(200).json({
      success: true,
      data: updatedSupplier[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
