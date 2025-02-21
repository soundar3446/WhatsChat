import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Spinner } from 'react-bootstrap';  // Install react-bootstrap for spinner
import { toast } from 'react-toastify';  // Install react-toastify for notifications

const ChatWindow = ({ recipient }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    // Helper function to add a new message without duplicates
    const addNewMessage = (newMessage) => {
        setMessages((prevMessages) => {
            // Check if message already exists
            if (prevMessages.some(msg => msg._id === newMessage._id)) {
                return prevMessages;
            }
            return [...prevMessages, newMessage];
        });
    };

    // Fetch messages when recipient changes
    useEffect(() => {
        if (!recipient || !recipient._id) {
            setLoading(false);
            return;
        }
    
        const fetchMessages = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const friendId = recipient._id;
    
                console.log("📩 Fetching messages for:", { userId, friendId });
    
                const response = await fetch(`http://localhost:5000/api/messages/${userId}/${friendId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
    
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
                const data = await response.json();
                console.log("✅ Messages fetched:", data);
    
                // More thorough deduplication using a Map
                const messageMap = new Map();
                data.data.forEach(msg => {
                    if (msg._id) {
                        messageMap.set(msg._id, msg);
                    }
                });
                
                // Convert back to array
                const uniqueMessages = Array.from(messageMap.values());
                setMessages(uniqueMessages);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
                setError("Failed to fetch messages");
                setLoading(false);
            }
        };
    
        fetchMessages();
    }, [recipient]);

    // Handle sending a message
    const handleSendMessage = async (messageObject) => {
        if (messageObject && messageObject._id) {
            console.log("✅ Adding new message directly to UI:", messageObject);
            addNewMessage(messageObject);
            return;
        }
        
        const messageText = messageObject;
        
        if (!userId || !recipient || !recipient._id || !messageText) {
            console.error("❌ Invalid sender, recipient, or empty message", { userId, recipient, messageText });
            setError("Invalid sender, recipient, or empty message");
            return;
        }
    
        const messageData = {
            sender: userId,
            receiver: recipient._id,
            content: messageText,
        };
    
        console.log("📤 Sending message:", messageData);
    
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(messageData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Failed to send message:", errorData);
                setError(errorData.message || "Failed to send message");
                toast.error('Error sending message. Please try again.');
                return;
            }
    
            const result = await response.json();
            console.log("✅ Message sent:", result.data);
            addNewMessage(result.data);
            toast.success('Message sent!');
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setError("Network error while sending message");
            toast.error('Network error. Please try again.');
        }
    };

    // Styling
    const styles = {
        chatWindow: {
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#36393F",
            overflow: "hidden",
        },
        chatContent: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#36393F",
            padding: "10px",
            overflowY: "auto",
            marginBottom: "60px", // Ensure space for input bar
        },
        error: {
            color: "red",
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#2c2f33",
            borderRadius: "5px",
        },
        loading: {
            textAlign: "center",
            padding: "10px",
            fontSize: "16px",
            color: "white",
        },
        noRecipient: {
            color: "white",
            textAlign: "center",
            padding: "20px",
            fontSize: "18px"
        },
        messageBubble: {
            maxWidth: "75%",
            padding: "10px 15px",
            borderRadius: "20px",
            marginBottom: "10px",
            display: "inline-block",
            wordBreak: "break-word",
            fontSize: "14px",
        },
        sentMessage: {
            backgroundColor: "#7289DA",
            alignSelf: "flex-end",
            color: "white",
        },
        receivedMessage: {
            backgroundColor: "#2C2F33",
            color: "white",
        },
        messageInputWrapper: {
            position: "sticky",
            bottom: 0,
            backgroundColor: "#36393F",
            padding: "10px",
            zIndex: 10,
        },
    };

    return (
        <div style={styles.chatWindow}>
            <ChatHeader recipient={recipient} />
            <div style={styles.chatContent}>
                {!recipient && (
                    <div style={styles.noRecipient}>
                        <p></p>
                    </div>
                )}
                {loading && (
                    <div style={styles.loading}>
                        <Spinner animation="border" variant="light" />
                        <p>Loading messages...</p>
                    </div>
                )}
                {error && (
                    <div style={styles.error}>
                        <p>{error}</p>
                    </div>
                )}
                {!loading && !error && recipient && <MessageList messages={messages} />}
            </div>
            {recipient && (
                <div style={styles.messageInputWrapper}>
                    <MessageInput recipient={recipient} onSendMessage={handleSendMessage} />
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
