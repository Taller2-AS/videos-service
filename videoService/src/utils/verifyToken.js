const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
config({ path: '.env' });
const { JWT_SECRET } = process.env;
const AppError = require('./appError');

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new AppError('Token inválido o expirado', 401);
    }
};

module.exports = verifyToken;
