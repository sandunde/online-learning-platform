const jwt = require('jsonwebtoken');
const { secretKey } = require('../configuration/jwtConfig');

function authenticateToken(req, res, next) {
    const autHeader = req.header('Authorization');

    if (!autHeader) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const [bearer, token] = autHeader.split(" ");
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
