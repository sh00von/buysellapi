// middleware/authorizationMiddleware.js
const authorize = (roles = []) => {
  // If roles is a string, convert it to an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      // User's role is not authorized
      return res.status(403).json({ message: 'Forbidden' });
    }
    // User is authorized
    next();
  };
};

module.exports = authorize;
