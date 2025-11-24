import dbPool from "../../config/dbConnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkEmailExist = async (req, res) => {
  try {
    const { email } = req.body;

    const sql = "SELECT 1 FROM staff WHERE email = ? LIMIT 1";
    const [rows] = await dbPool.query(sql, [email]);
    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Email available",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to check email. Please try again.",
    });
  }
};

export const sendVerifyOtp = async (req, res) => {};

export const register = async (req, res) => {
  try {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const phoneNo = req.body.phoneNo?.trim();
    const nicNo = req.body.nicNo?.trim();
    const address = req.body.address?.trim();
    const staffType = req.body.staffType;
    const email = req.body.email?.trim();
    const confirmPassword = req.body.confirmPassword?.trim();

    if (
      !firstName ||
      !lastName ||
      !phoneNo ||
      !nicNo ||
      !address ||
      !staffType ||
      !email ||
      !confirmPassword
    )
      return res.json({ success: false, message: "Fileds are required" });

    //check existing user
    const sqlUserExist = "SELECT * FROM staff WHERE email = ? LIMIT 1";
    const existingUser = await dbPool.query(sqlUserExist, [email]);

    if (existingUser.length > 0) {
      return res.json({ success: false, message: "Email already exist" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    //insert user
    const sqlInsert = `INSERT INTO staff (first_name, last_name, password, email, phone_number, nic_number, address, staff_type_id)
                            VALUES (?,?,?,?,?,?,?,?)`;
    const values = [
      firstName,
      lastName,
      hashedPassword,
      email,
      phoneNo,
      nicNo,
      address,
      staffType,
    ];
    await dbPool.query(sqlInsert, values);
    return res.json({ success: true, message: "signup successfully" });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Failed to register. Please try again.",
    });
  }
};
export const login = async (req, res) => {
  try {
    //Trimming
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    //check empty
    if (!email || !password)
      return res.json({ success: false, message: "Fields are required" });

    //check user exist
    const sql = `
            SELECT s.*, st.staff_type_name
            FROM staff s
            INNER JOIN staff_type st ON st.staff_type_id=s.staff_type_id
            WHERE s.email=?
            LIMIT 1;
        `;
    const result = await dbPool.query(sql, [email]);
    if (result.length === 0)
      return res.json({ success: false, message: "User does not exist" });

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

    //create jwt
    const token = jwt.sign({ id: result[0].staff_id }, process.env.JWT_SECRET);

    //create cookie
    const userLogged = {
      id: result[0].staff_id,
      name: result[0].first_name,
      role: result[0].staff_type_name,
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
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to login. Please try again." });
  }
};
export const isAuthenticated = async (req, res) => {};
export const logout = async (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Logout Successfully" });
};

export const verifyEmail = async (req, res) => {};
export const resetPassword = async (req, res) => {};
