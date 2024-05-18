const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Message = require('../models/message');

// Get all messages (for admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized, only admin can access this route' });
        }

        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Post a new message (for logged-in users)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const newMessage = new Message({
        useremail: req.user.email,
        content,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
