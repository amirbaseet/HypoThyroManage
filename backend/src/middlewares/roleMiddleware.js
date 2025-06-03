/**
 * Role-Based Authorization Middleware
 * 
 * Restricts access to routes based on user roles.
 * 
 * Usage:
 * - Use after `verifyToken` middleware (which sets `req.user`).
 * - Pass allowed roles as arguments.
 * 
 * Example:
 *   app.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => { ... });
 * 
 * @param {...string} allowedRoles - Roles allowed to access the route.
 * @returns {Function} Express middleware function.
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // Ensure `req.user` is set (should come from verifyToken middleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized: No valid user role found" });
        }

        // Debugging: Log the role trying to access
        // console.log(`User Role: ${req.user.role} | Allowed Roles: ${allowedRoles}`);

        // Check if user role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }

        next(); // Proceed if role is authorized
    };
};

module.exports = authorizeRoles;
