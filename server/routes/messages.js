const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// Get messages for global chat or private chat
router.get('/', auth, async (req, res) => {
  try {
    const { userId, limit = 50, skip = 0 } = req.query;
    
    let query = {};
    
    if (userId) {
      // Private messages between current user and specified user
      query = {
        $or: [
          { sender: req.user._id, recipient: userId },
          { sender: userId, recipient: req.user._id }
        ]
      };
    } else {
      // Global chat messages
      query = { recipient: null };
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// Get recent messages for global chat
router.get('/global', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const messages = await Message.find({ recipient: null })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Error fetching global messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
});

// Get private messages
router.get('/private/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Error fetching private messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching private messages'
    });
  }
});

module.exports = router;
