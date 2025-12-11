import transporter from "../../config/nodemailer.js";

export const sendEmailVerifyEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Mobile Stream Hub" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Mobile Stream Hub - Email Verification OTP",
    html: `
        <div style="font-family:Arial,sans-serif;font-size:14px">
          <h2 style="margin-bottom:8px">Email Verification OTP</h2>
          <p>Use the following One-Time Password (OTP) to verify your email. It expires in <strong>5 minutes</strong>. Keep it confidential and do not share it with anyone. </p>
          <p style="font-size:24px;letter-spacing:4px;font-weight:bold;color:#0d6efd;text-align:center">${otp}</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p>Best Regards,<br/>Mobile Stream Hub</p>
          <hr style="border:none;border-top:2px solid #eee;margin:20px 0">
          <p style="color:#777">This is an automated message. Please do not reply.</p>
        </div>
      `,
  });
};
