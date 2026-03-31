/**
 * Role-Based Access Control Middleware
 * Factory function that returns middleware checking if the
 * authenticated user has one of the allowed roles.
 *
 * Usage: router.delete('/products/:id', auth, roleCheck('admin'), controller)
 */
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. This action requires one of: ' + allowedRoles.join(', '),
      });
    }

    next();
  };
};

module.exports = roleCheck;
