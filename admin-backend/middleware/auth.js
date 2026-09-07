const jwt = require('jsonwebtoken')
const client = require('../middleware/redis')

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
    const redisKey = `user:${verifyToken.userId}:token`;
    client.get(redisKey, (err, storedToken) => {
      if (err) {
        console.error('Redis error:', err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!storedToken || storedToken !== token) {
        return res.status(401).json({ message: "Invalid Token" });
      }

      next();
    });
  } catch (e) {
    res.status(401).json({ message: "Invalid Token" })
  }
}

module.exports = { middleware } 