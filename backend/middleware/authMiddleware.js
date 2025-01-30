const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;  // Store the decoded user info
    next();  // Call next() to pass control to the next middleware
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
