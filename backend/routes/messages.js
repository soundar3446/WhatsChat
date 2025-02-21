const express = require('express');
const router = express.Router();
const User = require("../models/Users"); // ✅ Import User model
const messageController = require('../Controllers/message');
const { sendWhatsAppMessage } = require('../baileys/whatsappClient'); // Import Baileys function

// Route to send a message (database)
router.post('/send', messageController.sendMessage);

// Route to get messages between two users
router.get('/:userId/:friendId', messageController.getMessages);

// Route to send a message via WhatsApp
router.post('/send-whatsapp', async (req, res) => {
    try {
        console.log("📥 Incoming WhatsApp request:", req.body);

        // ✅ Extract values correctly
        const { sender, receiver, content } = req.body;

        // ✅ Log extracted values
        console.log("✅ Received sender:", sender);
        console.log("✅ Received receiver:", receiver);
        console.log("✅ Received content:", content);

        // ✅ Check if any required field is missing
        if (!sender || !receiver || !content) {
            console.error("🚨 Validation failed: Missing required fields");
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // 🔹 Fetch sender & receiver phone numbers from database
        const senderUser = await User.findOne({ phoneNumber: sender });
        const receiverUser = await User.findOne({ phoneNumber: receiver });

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 🔹 Ensure phone numbers exist
        const senderPhone = senderUser.phoneNumber;
        const receiverPhone = receiverUser.phoneNumber;

        if (!senderPhone || !receiverPhone) {
            return res.status(400).json({ success: false, message: 'Phone numbers not found' });
        }

        // 🔹 Send WhatsApp message
        await sendWhatsAppMessage(senderPhone, receiverPhone, content);

        return res.status(200).json({
            success: true,
            message: 'WhatsApp message sent successfully',
        });

    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send WhatsApp message',
            error: error.message
        });
    }
});




const Message = require("../models/Messages");


// Send message API endpoint
router.post("/send", async (req, res) => {
    try {
        const { sender, receiver, content, phoneNumber } = req.body;

        // Create and save message to MongoDB
        const newMessage = new Message({
            sender,
            receiver,
            content,
        });

        const savedMessage = await newMessage.save();

        // If phoneNumber is provided, also send via WhatsApp
        if (phoneNumber) {
            try {
                await sendWhatsAppMessage(phoneNumber, content);
                console.log(`✅ WhatsApp message sent to ${phoneNumber}`);
            } catch (whatsappError) {
                console.error(`❌ WhatsApp sending failed: ${whatsappError.message}`);
                // We don't fail the whole request if WhatsApp fails
                // Just log the error and continue
            }
        }

        res.status(201).json({
            success: true,
            data: savedMessage,
        });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message,
        });
    }
});

module.exports = router;
