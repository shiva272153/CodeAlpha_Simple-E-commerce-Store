const User = require('../models/user');

module.exports = async function (req, res, next) {
    try {
        // req.user is already set by auth middleware
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
