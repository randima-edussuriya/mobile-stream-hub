import dbPool from "../../config/dbConnection.js";

export const getCategories = async (req, res) => {
  try {
    const sql = "SELECT * FROM category ORDER BY category_id ASC";
    const [categories] = await dbPool.query(sql);
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // check if category exists
    const sqlCheck = "SELECT 1 FROM category WHERE category_id=?";
    const [rows] = await dbPool.query(sqlCheck, [categoryId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const sql = "DELETE FROM category WHERE category_id=?";
    await dbPool.query(sql, [categoryId]);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const sqlCheck = "SELECT * FROM category WHERE category_id=?";
    const [rows] = await dbPool.query(sqlCheck, [categoryId]);

    // check if category exists
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId, categoryName, categoryType } = req.body;

    // check if category exists
    const sqlCheck = "SELECT 1 FROM category WHERE category_id=?";
    const [rows] = await dbPool.query(sqlCheck, [categoryId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // update category
    const sqlUpdate =
      "UPDATE category SET category_name=?, category_type=? WHERE category_id=?";
    await dbPool.query(sqlUpdate, [categoryName, categoryType, categoryId]);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryType } = req.body;

    const sqlInsert =
      "INSERT INTO category (category_name, category_type) VALUES (?, ?)";
    await dbPool.query(sqlInsert, [categoryName, categoryType]);
    return res.status(201).json({
      success: true,
      message: "Category added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
