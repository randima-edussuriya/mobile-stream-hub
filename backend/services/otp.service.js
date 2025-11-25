import dbPool from "../config/dbConnection.js";

export const saveOtp = async (email, purpose) => {
  // generate 6-digit numeric OTP and expiration time
  const otp = String(Math.floor(Math.random() * 900000 + 100000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  // insert OTP record
  const insertSql = `INSERT INTO email_verify (email, otp, expires_at, purpose) 
                    VALUES (?,?,?,?)
                    ON DUPLICATE KEY UPDATE otp = VALUES(otp), expires_at = VALUES(expires_at), purpose = VALUES(purpose)`;
  await dbPool.query(insertSql, [email, otp, expiresAt, purpose]);
  return otp;
};
