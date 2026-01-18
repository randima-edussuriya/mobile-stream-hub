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

export const validateAddToCart = (req, res, next) => {
  const { itemId, quantity } = req.body;

  // validation
  for (const [key, value] of Object.entries({ itemId, quantity })) {
    // validate missing fields
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: `Missing required field: ${key}`,
      });
    }

    // validate numeric fields
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field: ${key}.`,
      });
    }

    req.body[key] = numValue; // convert to number
  }
  next();
};

export const validateId = (req, res, next) => {
  const { cartItemId } = req.params;

  // validate missing id
  if (
    cartItemId === undefined ||
    cartItemId === null ||
    (typeof cartItemId === "string" && cartItemId.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: cartItemId",
    });
  }

  // validate numeric id
  const numValue = Number(cartItemId);
  if (Number.isNaN(numValue) || numValue < 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: cartItemId.`,
    });
  }
  req.params.cartItemId = numValue; // convert to number
  next();
};

export const validateUpdateCart = (req, res, next) => {
  const { cartItems } = req.body;

  // validate cartItems is an array
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "cartItems must be a non-empty array",
    });
  }

  for (const cartItem of cartItems) {
    // validate missing fields
    for (const [key, value] of Object.entries(cartItem)) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${key}.`,
        });
      }

      // validate numeric fields
      const numValue = Number(value);
      if (Number.isNaN(numValue) || numValue < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid value for field: ${key}.`,
        });
      }
      cartItem[key] = numValue; // convert to number
    }
  }
  req.body.cartItems = cartItems;
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { email, newPassword, purpose } = req.body;

  // validate missing fields
  for (const [key, value] of Object.entries({ email, newPassword, purpose })) {
    if (typeof value !== "string" && value.trim() === "") {
      return res.status(400).json({
        success: false,
        message: `Missing required field: ${key}`,
      });
    }
    // validate email format
    if (key === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }
      req.body.email = value.toLocaleLowerCase().trim();
      continue;
    }

    // validate password strength
    if (
      key === "newPassword" &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must include at least one lowercase letter, one uppercase letter, one digit, one special character and be at least 8 characters long",
      });
    }
    req.body[key] = value.trim();
  }
  next();
};

export const validateGetDeliveryCost = (req, res, next) => {
  const { district } = req.query;

  // validate missing district
  if (typeof district !== "string" && district.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Missing required field: district",
    });
  }

  req.query.district = district.trim();
  next();
};

export const validateApplyCoupon = (req, res, next) => {
  const { code } = req.body;

  // validate missing code
  if (typeof code !== "string" || code.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid value for field: code",
    });
  }
  req.body.code = code.trim();
  next();
};

export const validatePlaceOrder = (req, res, next) => {
  // divide required and optional fields
  const { couponCode, ...requiredFields } = req.body;

  // validate required fields
  for (const [key, value] of Object.entries(requiredFields)) {
    if (typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid value for field: ${key}`,
      });
    }
    req.body[key] = value.trim();
  }

  // validate optional fields
  if (couponCode !== null) {
    if (typeof couponCode !== "string" || couponCode.trim() === "") {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field: couponCode`,
      });
    }
    req.body.couponCode = couponCode.trim();
  }

  const { paymentMethod } = req.body;
  if (!["online", "cod", "pickup"].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method selected",
    });
  }

  next();
};
