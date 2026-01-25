import transporter from "../../config/nodemailer.js";

export const sendReorderRequestEmail = async ({
  supplierEmail,
  supplierName,
  itemId,
  itemName,
  itemBrand,
  quantity,
}) => {
  await transporter.sendMail({
    from: `"Mobile Stream Hub" <${process.env.SENDER_EMAIL}>`,
    to: supplierEmail,
    subject: `Reorder Request - Item #${itemId} - ${itemName}`,
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
          <h2>Reorder Request</h2>
          <p>Dear ${supplierName},</p>
          <p>We would like to place a reorder for the item below:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
            <tbody>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: 600;">Item ID</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">${itemId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: 600;">Item Name</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">${itemName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: 600;">Brand</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">${itemBrand}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd; font-weight: 600;">Quantity Requested</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">${quantity} units</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 16px;">Please confirm availability and an estimated delivery timeline.</p>
          <p>Thank you,<br/>Mobile Stream Hub<br/><span style="font-size: 12px; color: #666;">${process.env.SENDER_EMAIL}</span></p>
        </body>
      </html>
    `,
  });
};
