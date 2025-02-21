import React, { useState, useCallback } from "react";

const MessageInput = ({ recipient, onSendMessage }) => {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);  // State for hover effect

    const handleSend = useCallback(async () => {
        console.log("📥 Message to send:", message);
        console.log("🔍 Debug recipient object:", recipient);

        if (!message.trim()) {
            setError("⚠️ Message cannot be empty!");
            return;
        }

        if (!recipient || !recipient._id || !(recipient.phone || recipient.phoneNumber)) {
            setError("⚠️ Invalid recipient! Missing ID or phone number.");
            console.error("🚨 Invalid recipient object:", recipient);
            return;
        }

        // Retrieve user details from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        const senderId = localStorage.getItem("userId") || storedUser._id;
        const senderPhone = localStorage.getItem("phoneNumber") || storedUser.phoneNumber;

        if (!senderId || !senderPhone) {
            console.error("🚨 Missing sender details in localStorage!");
            setError("⚠️ Sender details missing. Please log in again.");
            return;
        }

        // Store sender phone number in localStorage (if missing)
        if (!localStorage.getItem("phoneNumber")) {
            localStorage.setItem("phoneNumber", senderPhone);
        }

        const recipientPhone = recipient.phone || recipient.phoneNumber;

        const chatMessageData = {
            sender: senderId,
            receiver: recipient._id,
            content: message.trim(),
        };

        const whatsappMessageData = {
            sender: senderPhone,
            receiver: recipientPhone,
            content: message.trim(),
        };

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("🚨 No token found! User may not be authenticated.");
            setError("⚠️ Authentication failed. Please log in again.");
            return;
        }

        console.log("📩 Sending chatMessageData:", JSON.stringify(chatMessageData, null, 2));
        console.log("📩 Sending whatsappMessageData:", JSON.stringify(whatsappMessageData, null, 2));

        try {
            setIsSending(true);
            setError(null);

            const chatResponse = await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(chatMessageData),
            });

            if (!chatResponse.ok) {
                const errorData = await chatResponse.json();
                throw new Error(errorData.message || "Failed to store message in chat.");
            }

            const chatData = await chatResponse.json();
            console.log("✅ Message stored in chat successfully:", chatData);

            const whatsappResponse = await fetch("http://localhost:5000/api/messages/send-whatsapp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(whatsappMessageData),
            });

            if (!whatsappResponse.ok) {
                const whatsappErrorData = await whatsappResponse.json();
                console.error("❌ WhatsApp API Error Response:", whatsappErrorData);
                throw new Error(whatsappErrorData.message || "Failed to send WhatsApp message.");
            }

            console.log("📤 Message sent to WhatsApp!");

            onSendMessage(chatData.data);
            setMessage("");

        } catch (error) {
            console.error("❌ Error sending message:", error);
            setError(error.message);
        } finally {
            setIsSending(false);
        }
    }, [message, recipient, onSendMessage]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isSending) {
            handleSend();
        }
    };

    return (
        <div
            style={{
                padding: "12px",
                backgroundColor: "#2C2F33",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "20px",
                    border: "1px solid #3A3F47",
                    fontSize: "16px",
                    color: "white",
                    backgroundColor: "#3A3F47",
                    transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => e.target.style.borderColor = "#7289DA"}
                onBlur={(e) => e.target.style.borderColor = "#3A3F47"}
            />
            <button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                onMouseEnter={() => !isSending && setIsHovered(true)}  // Set hover state
                onMouseLeave={() => !isSending && setIsHovered(false)} // Reset hover state
                style={{
                    padding: "12px 18px",
                    backgroundColor: isSending || !message.trim() ? "#5865F2" : (isHovered ? "#5a72b1" : "#7289DA"),
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: isSending || !message.trim() ? "not-allowed" : "pointer",
                    transition: "background-color 0.3s ease",
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
