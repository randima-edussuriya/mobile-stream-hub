import transporter from "../../config/nodemailer.js";

export const sendSubmitInquiryEmail = async (customer) => {
  await transporter.sendMail({
    from: `"Mobile Stream Hub" <${process.env.SENDER_EMAIL}>`,
    to: process.env.SENDER_EMAIL,
    subject: `Customer Inquiry - ${customer.subject}`,
    html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px">
          <h2 style="margin-bottom: 8px">Customer Inquiry</h2>
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone Number:</strong> ${customer.phoneNo}</p>
          <p><strong>Address:</strong> ${customer.address}</p>
          <hr style="margin: 20px 0" />
          <p><strong>Subject:</strong> ${customer.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line">${customer.message}</p>
          <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0" />
          <p style="color: #777">
            This email was automatically generated from your website's Contact Us page.
          </p>
        </div>
      `,
  });
};
