import jwt from 'jsonwebtoken'
import env from '../config/env.js';
const generateAccessToken = (payload) => {
    return jwt.sign(
        {userId: payload.userId, role: payload.role},
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '3m' }
    )
}

const generateRefreshToken = (payload) => {
    return jwt.sign(
        {userId: payload.userId, role: payload.role},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '5m' }
    )
}


const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };