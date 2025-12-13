import dbPool from "../../config/dbConnection.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const [suppliers] = await dbPool.query("SELECT * FROM supplier");
    return res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
