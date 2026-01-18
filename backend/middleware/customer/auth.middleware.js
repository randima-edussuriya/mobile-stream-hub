import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Please login again.",
    });
  try {
    //verify token
    const tokenDecoded = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = { userId: tokenDecoded.userId, email: tokenDecoded.email };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
