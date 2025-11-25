import dbPool from "../../config/dbConnection.js";
import { sendEmailVerifyEmail } from "../../services/email/sharedEmail.service.js";
import { saveOtp } from "../../services/otp.service.js";

// map purposes to email handlers
const emailHandlers = {
  staff_registration: sendEmailVerifyEmail,
  customer_registration: sendEmailVerifyEmail,
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    // validate purpose
    const allowedPurposes = [
      "staff_registration",
      "customer_registration",
      "password_reset",
    ];
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
    const otp = await saveOtp(email, purpose);

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
