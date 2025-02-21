const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/message');
const { sendWhatsAppMessage } = require('../baileys/whatsappClient'); // Import Baileys function

// Route to send a message (database)
router.post('/send', messageController.sendMessage);

// Route to get messages between two users
router.get('/:userId/:friendId', messageController.getMessages);

// Route to send a message via WhatsApp
router.post('/send-whatsapp', async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        if (!sender || !receiver || !content) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const result = await sendWhatsAppMessage(sender, receiver, content);
        return res.status(200).json({
            success: true,
            message: 'WhatsApp message sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send WhatsApp message',
            error: error.message
        });
    }
});

module.exports = router;
