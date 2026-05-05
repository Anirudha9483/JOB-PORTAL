const jwt = require('jsonwebtoken');

// Middleware to verify token and check roles
const protect = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Get token from header: "Bearer <token>"
            let token = req.headers.authorization;
            
            if (!token || !token.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            token = token.split(' ')[1]; // Extract the actual token

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach the decoded payload (id, role) to the request object

            // Check if the user's role is allowed to access this route
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: You do not have the required permissions." });
            }

            next(); // Move to the next function/controller
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token." });
        }
    };
};

module.exports = protect;