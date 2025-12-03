// server/middleware/authMiddleware.js

// Require user to be logged in
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

// Require admin role
function requireAdmin(req, res, next) {
  if (req.session && req.session.userRole === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

module.exports = {
  requireAuth,
  requireAdmin
};
