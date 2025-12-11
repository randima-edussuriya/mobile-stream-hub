import dbPool from "../../config/dbConnection.js";

export const getMeBasicData = async (req, res) => {
  try {
    const { userId } = req.user;

    const sql = "SELECT first_name, email FROM customer WHERE customer_id=?";
    const [user] = await dbPool.query(sql, [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: { name: user[0].first_name, email: user[0].email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const sql = `
        SELECT customer_id, first_name, last_name, email, phone_number, address, created_at
        FROM customer
        WHERE customer_id=? AND is_active=true`;
    const [user] = await dbPool.query(sql, [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const { firstName, lastName, phoneNo, address } = req.body;

    // check if user exists
    const [existingUser] = await dbPool.query(
      "SELECT 1 FROM customer WHERE customer_id=? AND is_active=true",
      [userId]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // update user data
    const sql = `
        UPDATE customer
        SET first_name=?, last_name=?, phone_number=?, address=?
        WHERE customer_id=?`;
    await dbPool.query(sql, [firstName, lastName, phoneNo, address, userId]);
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
