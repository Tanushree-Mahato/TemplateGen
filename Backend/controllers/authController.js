const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const MAX_DEVICES = 10;

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password, deviceInfo, ipAddress} = req.body; // Default values
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        user.sessions = user.sessions.filter(session => session.expiresAt > new Date());
        if (user.sessions.length >= MAX_DEVICES) {
            return res.status(403).json({ message: 'Maximum device limit reached. Please log out from another device.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        const session = {
            token,
            deviceInfo,
            ipAddress,
            expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // 1 hour expiration
        };
        user.sessions.push(session);
        await user.save();
        res.status(201).json({ token, message: 'Template uploaded successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const user = await User.findById(req.user.id);
        user.sessions = user.sessions.filter(session => session.token !== token);
        await user.save();
        res.json({ message: 'Logged out from this device' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logoutAllDevices = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.sessions = [];
        await user.save();

        res.json({ message: 'Logged out from all devices' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};