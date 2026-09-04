const jwt = require('jsonwebtoken')

const middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" })
  }
 
  // supports both "Bearer <token>" and a raw token
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verifyToken
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid Token" })
  }
}

module.exports = { middleware }