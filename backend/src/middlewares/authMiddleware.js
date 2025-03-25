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

            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("❌ Token verification error:", error);
        res.status(500).json({ message: "Something went wrong with token verification." });
    }
};

module.exports = verifyToken;
