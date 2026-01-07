export const validateSendVerifyOtp = (req, res, next) => {
  const { email, purpose } = req.body;

  for (const [key, value] of Object.entries({ email, purpose })) {
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
    req.body[key] = value.trim();
  }
  next();
};

export const validateVerifyOtp = (req, res, next) => {
  const { email, otp, purpose } = req.body;

  for (const [key, value] of Object.entries({ email, otp, purpose })) {
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

    // validate otp format
    if (key === "otp" && !/^\d{6}$/.test(value)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP format" });
    }
    req.body[key] = value.trim();
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const email = req.body.email?.trim().toLocaleLowerCase();
  const password = req.body.password?.trim();

  // validate empty fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  // validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  req.body = { email, password };
  next();
};
