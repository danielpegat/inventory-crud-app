/**
 * JWT Authentication Middleware
 * Verifies the Bearer token from the Authorization header.
 * Attaches the decoded user payload to req.user for downstream use.
 */
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" format
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh or login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

module.exports = auth;
