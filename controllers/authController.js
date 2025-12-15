const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters' });
        }

        // Check existing
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'User with this email already exists' });

        // Hash & Save
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });

        res.status(201).json({ msg: 'Registration successful. Please login.' });
    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        // Validation
        if (!email || !password) {
            console.log('Login failed: Missing fields');
            return res.status(400).json({ msg: 'Please provide email and password' });
        }

        // Check User
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check Password
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            console.log('Login failed: Password mismatch');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Token
        const payload = { user: { id: user._id, email: user.email, name: user.name } };
        const secret = process.env.JWT_SECRET || 'secret_key_123';
        const token = jwt.sign(payload, secret, { expiresIn: '7d' });

        console.log('Login successful for:', email);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};
