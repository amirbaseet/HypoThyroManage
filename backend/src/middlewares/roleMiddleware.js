const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // Ensure `req.user` is set (should come from verifyToken middleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized: No valid user role found" });
        }

        // Debugging: Log the role trying to access
        console.log(`User Role: ${req.user.role} | Allowed Roles: ${allowedRoles}`);

        // Check if user role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }

        next(); // Proceed if role is authorized
    };
};

module.exports = authorizeRoles;
