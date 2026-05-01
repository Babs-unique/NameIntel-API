const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role;
        if (!userRole) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user role found"
            });
        }

        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: User does not have the required role"
            });
        }

        next();
    };
};

export default checkRole;