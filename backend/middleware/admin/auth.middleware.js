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
    req.body = {
      ...req.body,
      userId: tokenDecoded.userId,
      role: tokenDecoded.role,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.body;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden access. You do not have permission to perform this action.",
      });
    }
    next();
  };
};
