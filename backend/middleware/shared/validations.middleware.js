export const validateSendVerifyOtp = (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const purpose = String(req.body.purpose || "").trim();

  // validate empty
  if (!email || !purpose) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  // validate format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  req.body = { email, purpose };
  next();
};

export const validateVerifyOtp = (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  const otp = String(req.body.otp || "").trim();
  const purpose = String(req.body.purpose || "").trim();

  // validate empty
  if (!email || !otp || !purpose) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // validate otp format
  if (!/^\d{6}$/.test(otp)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP format" });
  }

  req.body = { email, otp, purpose };
  next();
};

export const validateLogin = (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLocaleLowerCase();
  const password = String(req.body.password || "").trim();

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
