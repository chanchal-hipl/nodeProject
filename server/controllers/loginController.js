const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.showLoginForm = (req, res) => {
    res.render('login');
};

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
