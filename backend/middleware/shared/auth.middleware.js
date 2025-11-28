import dbPool from "../../config/dbConnection.js";

export const isVerifiedOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    const selectOtpSql =
      "SELECT 1 FROM email_verify WHERE email = ? AND purpose = ? AND is_verified = TRUE AND expires_at > NOW() LIMIT 1";
    const [rows] = await dbPool.query(selectOtpSql, [email, purpose]);
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "OTP not verified or expired" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
