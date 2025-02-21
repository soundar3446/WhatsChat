// Controllers/message.js
const Message = require('../models/Messages');

exports.sendMessage = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);  // 👀 Debug request body
    
    const { sender, content, receiver } = req.body;
    
    if (!sender || !content || !receiver) {
      console.error("Missing required fields:", { sender, content, receiver });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const newMessage = new Message({ sender, receiver, content, status: 'sent' });
    const savedMessage = await newMessage.save();
    
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name')
      .populate('receiver', 'name');

    return res.status(201).json({ success: true, data: populatedMessage });

  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    
    // Find messages where the users are either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    })
    .sort({ createdAt: 1 }) // Sort chronologically
    .populate('sender', 'name') // Populate sender with name field
    .populate('receiver', 'name'); // Populate receiver with name field
    
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};