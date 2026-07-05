const jwt = require('jsonwebtoken');

/**
 * Middleware to verify custom JWT token sent in Request Authorization headers.
 * 
 * INTERVIEW HIGHLIGHT:
 * How to explain this in an interview:
 * "I built custom JWT middleware. It extracts the 'Bearer <token>' from the HTTP Authorization header, 
 * validates the token signature using jsonwebtoken and a secret key, and decrypts the user payload.
 * If validation succeeds, it binds the userId to the Express `req` object and calls `next()`.
 * If it fails (expired, invalid signature, or missing), it halts execution with a clean 401 Unauthorized response."
 */
const authMiddleware = (req, res, next) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_resume_iq_2026');
    req.user = { id: decoded.id }; // Bind verified user data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

module.exports = authMiddleware;
