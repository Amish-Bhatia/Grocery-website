const jwt = require("jsonwebtoken");
const Users = require("../Models/userModel");


const middleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not provided"
    });
  }


  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;


  try {
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await Users.findById(verifyToken.userId)
      .select("-password -otp")
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "User account is inactive"
      });
    }

    req.user = user;

    next();

  } catch (e) {
    return res.status(401).json({
      message: "Invalid Token"
    });
  }
};

const authorize = (resource, action) => (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  if (req.user?.role === "staff" && req.user.permissions?.[resource]?.[action]) {
    return next();
  }

  return res.status(403).json({
    message: "You do not have permission to perform this action"
  });
};

module.exports = { middleware, authorize };