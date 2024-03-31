const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * Middleware function to verify the authenticity of a token.
 * It checks if the token exists in the request headers, and then verifies it.
 * If the token is valid, it decodes the token and attaches the decoded information to the request object.
 * If the token is invalid or not present, it sends a 403 (Forbidden) or 401 (Unauthorized) response respectively.
 * 
 * @param {object} req - The request object from Express.
 * @param {object} res - The response object from Express.
 * @param {function} next - The next middleware function in the Express stack.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    return next();
};


/**
 * Middleware function to verify if the user associated with a given token is an admin.
 * It first verifies the token using a similar approach as verifyToken.
 * After verifying the token, it checks if the user associated with the token has admin privileges.
 * If the user is an admin, the next middleware is called.
 * If not, it sends a 401 (Unauthorized) response indicating that the user is not an admin.
 * 
 * @param {object} req - The request object from Express.
 * @param {object} res - The response object from Express.
 * @param {function} next - The next middleware function in the Express stack.
 */
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer Token

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    let user_id = await userModel.getUserIdFromToken(token);
    if (await userModel.isAdmin(user_id)) {
        return next();
    }

    return res.status(401).json({ message: 'Not admin.' });
};


module.exports = { verifyToken, verifyAdmin };
