import dbPool from "../../config/dbConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, password, email, phoneNo, address } = req.body;

    //check existing user
    const sqlUserExist = "SELECT 1 FROM customer WHERE email = ? LIMIT 1";
    const [existingUser] = await dbPool.query(sqlUserExist, [email]);
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //insert user
    const sqlInsert = `INSERT INTO customer (first_name, last_name, password, email, phone_number, address)
                            VALUES (?,?,?,?,?,?,?,?)`;
    await dbPool.query(sqlInsert, [
      firstName,
      lastName,
      hashedPassword,
      email,
      phoneNo,
      address,
    ]);
    return res
      .status(201)
      .json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user exist
    const sql = `
            SELECT customer_id, password, is_active FROM customer
            WHERE email=? LIMIT 1;
        `;
    const [user] = await dbPool.query(sql, [email]);
    if (user.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });

    //check user is deactive
    if (user[0].is_active === 0)
      return res
        .status(403)
        .json({ success: false, message: "User is Deactivated" });

    //check hash password
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    //create jwt
    const token = jwt.sign(
      { userId: user[0].customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    //create cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  return res.status(200).json({ success: true, message: "Authenticated" });
};

export const logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
