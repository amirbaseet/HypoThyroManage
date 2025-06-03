/**
 * Authentication Middleware
 * 
 * Verifies the presence and validity of a JWT token in the Authorization header.
 * 
 * Expected header format:
 *   Authorization: Bearer <token>
 * 
 * If the token is valid, the decoded user information is attached to `req.user` for further use.
 * If the token is invalid or missing, responds with a 401 (unauthorized) or 403 (forbidden) status.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * 
 * @returns {void} Sends an error response or calls `next()` if authentication passes.
 */

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }
            // Attach the decoded user info to the request object for use in protected routes
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("❌ Token verification error:", error);
        res.status(500).json({ message: "Something went wrong with token verification." });
    }
};

module.exports = verifyToken;
