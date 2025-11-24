export const validateEmail = (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  // validate empty
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  // validate format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  req.body.email = email;
  next();
};
