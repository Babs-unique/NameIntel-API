export const getCookieOptions = (req, type = 'access') => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = req.protocol === 'https' || isProduction;

    const baseOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax'
    };

    if (type === 'access') {
        return {
            ...baseOptions,
            maxAge: 15 * 60 * 1000 // 15 minutes
        };
    }

    if (type === 'refresh') {
        return {
            ...baseOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };
    }

    return baseOptions;
};
