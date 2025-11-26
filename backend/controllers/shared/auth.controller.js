import dbPool from "../../config/dbConnection.js";
import { sendEmailVerifyEmail } from "../../services/email/sharedEmail.service.js";

// map purposes to email handlers
const emailHandlers = {
  staff_registration: sendEmailVerifyEmail,
  customer_registration: sendEmailVerifyEmail,
};

const allowedPurposes = [
  "staff_registration",
  "customer_registration",
  "password_reset",
];

export const sendVerifyOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    // validate purpose
    if (!allowedPurposes.includes(purpose)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP purpose" });
    }

    if (purpose === "staff_registration") {
      //check existing user
      const sqlUserExist = "SELECT 1 FROM staff WHERE email = ? LIMIT 1";
      const [existingUser] = await dbPool.query(sqlUserExist, [email]);
      if (existingUser.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Email already registered" });
      }
    }
    if (purpose === "customer_registration") {
    }

    if (purpose === "password_reset") {
    }

    //save otp in db
    // generate 6-digit numeric OTP and expiration time
    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // insert OTP record
    const insertSql = `INSERT INTO email_verify (email, otp, expires_at, purpose) 
                    VALUES (?,?,?,?)
                    ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at), purpose = VALUES(purpose), is_verified = FALSE`;
    await dbPool.query(insertSql, [email, otp, expiresAt, purpose]);

    //send email
    const emailHandler = emailHandlers[purpose];
    await emailHandler(email, otp);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, Please try again later",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    // find valid otp record
    const selectSql =
      "SELECT * FROM email_verify WHERE email = ? AND purpose = ? LIMIT 1";
    const [rows] = await dbPool.query(selectSql, [email, purpose]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "OTP not found, Please request a new one",
      });
    }

    // valid otp
    if (rows[0].otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // valid expiration
    if (new Date(rows[0].expires_at) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // mark otp as verified
    const updateOtpSql =
      "UPDATE email_verify SET is_verified = TRUE WHERE email_verify_id = ?";
    await dbPool.query(updateOtpSql, [rows[0].email_verify_id]);
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, Please try again later",
    });
  }
};
