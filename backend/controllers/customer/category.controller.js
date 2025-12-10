import dbPool from "../../config/dbConnection.js";

export const getCategories = async (req, res) => {
  try {
    const sql = "SELECT * FROM category WHERE category_type!='repair part'";
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
