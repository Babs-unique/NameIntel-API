import jwt from 'jsonwebtoken'
import env from '../config/env.js';

const buildTokenPayload = (payload) => ({
    userId: payload.userId || payload.id || payload._id,
    role: payload.role
});

const generateAccessToken = (payload) => {
    return jwt.sign(
        buildTokenPayload(payload),
        env.jwtSecret,
        { expiresIn: '3m' }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        buildTokenPayload(payload),
        env.jwtRefreshSecret,
        { expiresIn: '5m' }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwtRefreshSecret);
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };