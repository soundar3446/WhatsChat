const express = require("express");
const authenticate = require("/home/sounat/Desktop/Last/backend/middleware/authMidlleware.js");
const User = require("/home/sounat/Desktop/Last/backend/models/Users");

const router = express.Router();

// Get recipients for logged-in user
router.get("/recipients", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("recipients", "name phoneNumber");
        if (!user) return res.status(404).json({ error: "User not found" });

        console.log("Recipients found:", user.recipients);
        res.json({ recipients: user.recipients });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipients" });
    }
});




// Add recipients to a user
router.post("/add-recipients", authenticate, async (req, res) => {
    try {
        const { phoneNumber, username } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if recipient already exists as a user
        let recipient = await User.findOne({ phoneNumber });

        // If recipient doesn't exist, create a new user
        if (!recipient) {
            recipient = new User({ name: username, phoneNumber, password: "default_password" }); // Password should be hashed properly in a real app
            await recipient.save();
        }

        // Ensure the recipient is not already in the user's recipients list
        if (!user.recipients.includes(recipient._id)) {
            user.recipients.push(recipient._id);
            await user.save();
        }

        res.json({ message: "Recipient added successfully!", recipient });
    } catch (error) {
        console.error("❌ Error adding recipient:", error);
        res.status(500).json({ error: "Failed to add recipient" });
    }
});


module.exports = router;
