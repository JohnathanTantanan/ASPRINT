const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUser = async (req) => {
    try {
        const token = req.cookies.token;
        if (!token) return null;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return user;
    } catch (error) {
        return null;
    }
};

module.exports = { getUser };
