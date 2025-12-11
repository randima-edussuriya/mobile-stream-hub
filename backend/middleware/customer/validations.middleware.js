export const validateRegister = (req, res, next) => {
  const firstName = req.body.firstName?.trim();
  const lastName = req.body.lastName?.trim();
  const password = req.body.password?.trim();
  const email = req.body.email?.trim().toLocaleLowerCase();
  const phoneNo = req.body.phoneNo?.trim();
  const address = req.body.address?.trim();
  const purpose = req.body.purpose?.trim();

  // validate empty fields
  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !phoneNo ||
    !address ||
    !purpose
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate password strength
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Password must include at least one lowercase letter, one uppercase letter, one digit, one special character and be at least 8 characters long",
    });
  }

  // validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // validate phone number format
  if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format" });
  }

  req.body = {
    firstName,
    lastName,
    password,
    email,
    phoneNo,
    address,
    purpose,
  };
  next();
};

export const validateUpdateMe = (req, res, next) => {
  const firstName = req.body.firstName?.trim();
  const lastName = req.body.lastName?.trim();
  const phoneNo = req.body.phoneNo?.trim();
  const address = req.body.address?.trim();

  console.log(req.body);
  // validate empty fields
  if (!firstName || !lastName || !phoneNo || !address) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate phone number format
  if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format" });
  }
  req.body = {
    firstName,
    lastName,
    phoneNo,
    address,
  };
  next();
};

export const validateSubmitInquiry = (req, res, next) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLocaleLowerCase();
  const address = req.body.address?.trim();
  const phoneNo = req.body.phoneNo?.trim();
  const subject = req.body.subject?.trim();
  const message = req.body.message?.trim();

  // validate empty fields
  if (!name || !email || !address || !phoneNo || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // validate phone number format
  if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format" });
  }

  req.body = {
    name,
    email,
    address,
    phoneNo,
    subject,
    message,
  };
  next();
};
