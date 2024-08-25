const jwt = require("jsonwebtoken");
const secretKey = require("../configuration/jwtConfig");

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, secretKey, {expiresIn: "1h"})
}

function generateRefreshToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, secretKey, {expiresIn: "7h"})
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}


module.exports = {generateToken, generateRefreshToken, verifyToken}