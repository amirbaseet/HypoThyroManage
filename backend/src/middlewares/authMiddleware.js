const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;

        // Check if Authorization header exists and starts with "Bearer"
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }

        // If no token is found, return 401 (Unauthorized)
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            // Attach the decoded token data to req.user
            req.user = decoded;
            console.log("The decoded user is :", req.user)
            next(); // Proceed to the next middleware or route
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong with token verification." });
    }
};

module.exports = verifyToken;
