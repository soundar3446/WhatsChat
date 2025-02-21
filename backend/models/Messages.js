// models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The user who sent the message
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The user who received the message
        required: true
    },
    content: {
        type: String,
        required: true, // The actual message content
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the message creation time
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'], // Status of the message
        default: 'sent'
    }
});

module.exports = mongoose.model('Message', messageSchema);
