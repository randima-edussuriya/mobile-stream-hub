export const validateRegister = (req, res, next) => {
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const password = String(req.body.password || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLocaleLowerCase();
  const phoneNo = String(req.body.phoneNo || "").trim();
  const nicNo = String(req.body.nicNo || "").trim();
  const address = String(req.body.address || "").trim();
  const staffTypeId = String(req.body.staffTypeId || "").trim();
  const purpose = String(req.body.purpose || "").trim();

  // validate empty fields
  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !phoneNo ||
    !nicNo ||
    !address ||
    !staffTypeId ||
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

  // validate NIC format
  if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nicNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid NIC number format" });
  }

  req.body = {
    firstName,
    lastName,
    password,
    email,
    phoneNo,
    nicNo,
    address,
    staffTypeId,
    purpose,
  };
  next();
};

export const validateUpdateUserStatus = (req, res, next) => {
  const staffId = req.params.staffId?.trim();
  const { isActive, userId } = req.body;
  // validate staffId
  if (!staffId || isNaN(staffId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid staff ID" });
  }

  // validate isActive (must be boolean)
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Expecting true or false.",
    });
  }

  // prevent deativating own account
  if (userId == staffId)
    return res.status(403).json({
      success: false,
      message: "You cannot change the status of your own account.",
    });

  req.body.staffId = staffId;
  next();
};

export const validateUpdateCustomerStatus = (req, res, next) => {
  const customerId = req.params.customerId?.trim();
  const { isActive, userId } = req.body;
  // validate customerId
  if (!customerId || isNaN(customerId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid customer ID" });
  }

  // validate isActive (must be boolean)
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Expecting true or false.",
    });
  }

  req.body.customerId = customerId;
  next();
};
