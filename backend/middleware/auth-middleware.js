const jwt = require('jsonwebtoken')
require('dotenv').config();
const verifyToken = (token,secretKey) =>
{
    return jwt.verify(token,secretKey);
}
const authenticateMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
    {
        return res.status(401).json({
            success: false,
            message: 'User is not authenticated'
        })
    }
    const token = authHeader.split(' ')[1];
    const payload  = verifyToken(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
}
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied. Admins only!' });
    }
    next();
};
const isRecruiter = (req,res,next) => {
    if (req.user.role !== 'recruiter') {
        return res.status(403).json({ message: 'Access Denied. Recruiter only!' });
    }
    next();
}
module.exports = {authenticateMiddleware , isAdmin, isRecruiter};