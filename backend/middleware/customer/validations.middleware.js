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
