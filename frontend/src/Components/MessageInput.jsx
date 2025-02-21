import React, { useState, useCallback } from "react";

const MessageInput = ({ recipient, onSendMessage }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Optimized handleSend with useCallback to prevent unnecessary re-renders
    const handleSend = useCallback(async () => {
        console.log("📥 Message to send:", message); // Debug log
    
        if (!message.trim()) {
            setError("⚠️ Message cannot be empty!");
            return;
        }
    
        if (!recipient || !recipient._id) {
            setError("⚠️ Invalid recipient!");
            return;
        }
    
        const senderId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
    
        const messageData = {
            sender: senderId,
            receiver: recipient._id,
            content: String(message.trim()),  // ✅ Ensure content is a string
        };
    
        console.log("📩 Sending messageData:", messageData); // Debugging log
    
        try {
            setIsSending(true);
            setError(null);
            
            // Make API call as before
            const response = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(messageData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to send message.");
            }
            
            const data = await response.json();
            console.log("✅ Message sent successfully:", data);
            
            // CHANGE: Pass the complete message object from API response
            onSendMessage(data.data);
            
            setMessage(""); //// ✅ Clear input after successful send
        } catch (error) {
            console.error("❌ Error sending message:", error);
            setError(error.message);
        } finally {
            setIsSending(false);
        }
    }, [message, recipient, onSendMessage]);
    

    // ✅ Send message on "Enter" key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div
            style={{
                padding: "10px",
                backgroundColor: "#2C2F33",
                display: "flex",
                alignItems: "center",
                gap: "10px",
            }}
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                style={{
                    flex: 1, // ✅ Makes input take up full space
                    padding: "12px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "16px",
                    color: "white",
                    backgroundColor: "#3A3F47",
                }}
            />
            <button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                style={{
                    padding: "12px 18px",
                    backgroundColor: isSending || !message.trim() ? "#5865F2" : "#7289DA",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: isSending || !message.trim() ? "not-allowed" : "pointer",
                }}
            >
                {isSending ? "Sending..." : "Send"}
            </button>

            {error && (
                <div style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default MessageInput;
