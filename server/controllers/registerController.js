const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.showRegisterForm = (req, res) => {
    res.render('register');
};

exports.handleRegister = async (req, res) => {
    const { name, email, contact_number, address, password, confirmPassword } = req.body;
    
    if (!name || !email || !contact_number || !address || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            contact,
            address,
            password: hashedPassword,
        });

        await user.save();
        res.json({ success: true, message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
