import db from "../../config/dbConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const phoneNo = req.body.phoneNo?.trim();
    const address = req.body.address?.trim();
    const email = req.body.email?.trim();
    const confirmPassword = req.body.confirmPassword?.trim();

    if (
      !firstName ||
      !lastName ||
      !phoneNo ||
      !address ||
      !email ||
      !confirmPassword
    )
      return res.json({ success: false, message: "Fileds are required" });

    //check existing user
    const sqlUserExist = "SELECT * FROM customer WHERE email = ? LIMIT 1";
    const existingUser = await db.query(sqlUserExist, [email]);

    if (existingUser.length > 0) {
      return res.json({ success: false, message: "Email already exist" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    //insert user
    const sqlInsert =
      "INSERT INTO customer (`first_name`, `last_name`, `password`, `email`, `phone_number`, `address`) VALUES (?,?,?,?,?,?)";
    const values = [
      firstName,
      lastName,
      hashedPassword,
      email,
      phoneNo,
      address,
    ];
    await db.query(sqlInsert, values);
    return res.json({ success: true, message: "signup successfully" });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Failed to signup. Please try again.",
    });
  }
};
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    if (!email || !password)
      return res.json({ success: false, message: "Fields are required" });

    //check user exist
    const sql = "SELECT * FROM customer WHERE `email`= ? LIMIT 1";
    const result = await db.query(sql, [email]);
    if (result.length === 0) {
      return res.json({ success: false, message: "User does not exist" });
    }

    //check user is deactive
    if (result[0].is_active === 0)
      return res.json({ success: false, message: "User is Deactivated" });

    //check hash password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      result[0].password
    );

    if (!isPasswordCorrect)
      return res.json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: result[0].customer_id },
      process.env.JWT_SECRET
    );
    const userLogged = {
      id: result[0].customer_id,
      name: result[0].first_name,
    };
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({
      success: true,
      message: "Logged in successfully",
      data: userLogged,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Failed to login. Please try again.",
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Successfully logout" });
};
