import { sendSubmitInquiryEmail } from "../../services/email/customerEmail.service.js";

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, address, phoneNo, subject, message } = req.body;
    await sendSubmitInquiryEmail({
      name,
      email,
      address,
      phoneNo,
      subject,
      message,
    });
    return res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
