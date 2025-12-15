const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/user');

router.post('/register', register);
router.post('/login', login);

// Temporary Promotion Route
router.get('/promote/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { isAdmin: true },
            { new: true }
        );
        if (!user) return res.json({ msg: 'User not found' });
        res.json({ msg: `Success! ${user.name} is now an Admin.`, user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;