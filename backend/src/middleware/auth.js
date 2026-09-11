const jwt = require('jsonwebtoken');
const { failure } = require('../utils/response');

// Verifies the JWT and attaches the decoded payload ({ id, email, role }) to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return failure(res, 'Authentication required.', 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    return next();
  } catch (err) {
    return failure(res, 'Invalid or expired session. Please log in again.', 401);
  }
}

// Restricts a route to specific roles. Use after requireAuth.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return failure(res, 'You do not have permission to perform this action.', 403);
    }
    return next();
  };
}

// Back-compat alias — most existing admin routes were written against this name.
const requireAdmin = [requireAuth, requireRole('ADMIN', 'SUPER_ADMIN')];

module.exports = { requireAuth, requireRole, requireAdmin };
