import React from "react";

const MessageList = ({ messages }) => {
    const currentUserId = localStorage.getItem("userId"); // Logged-in User ID
    
    // Log received messages for debugging
    console.log("Messages Received:", messages);

    // Ensure messages is an array
    if (!Array.isArray(messages)) {
        console.error("Expected messages to be an array, but got:", messages);
        return <p style={{ color: "white", textAlign: "center" }}>Error: Invalid message format</p>;
    }

    const styles = {
        container: {
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#36393F",
            color: "#b9bbbe"
        },
        messageContainer: {
            marginBottom: "15px",
            padding: "8px",
            borderRadius: "5px",
            maxWidth: "70%"
        },
        sentMessage: {
            alignSelf: "flex-end",
            backgroundColor: "#7289DA",
            marginLeft: "auto"
        },
        receivedMessage: {
            alignSelf: "flex-start",
            backgroundColor: "#40444b"
        },
        messageWrapper: {
            display: "flex",
            flexDirection: "column",
            width: "100%"
        },
        senderName: {
            fontWeight: "bold",
            marginBottom: "3px",
            color: "#ffffff"
        },
        messageContent: {
            color: "#ffffff",
            wordBreak: "break-word"
        },
        timestamp: {
            fontSize: "11px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "5px",
            alignSelf: "flex-end"
        },
        noMessages: {
            textAlign: "center",
            color: "#b9bbbe",
            padding: "20px"
        }
    };

    return (
        <div style={styles.container}>
            {messages.length === 0 ? (
                <p style={styles.noMessages}>No messages yet. Start the conversation!</p>
            ) : (
                <div style={styles.messageWrapper}>
                    {messages
                        .filter(msg => msg.content && typeof msg.content === "string") // Filter out invalid messages
                        .map((msg, index) => {
                            const senderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
                            const isCurrentUser = senderId === currentUserId;

                            // Determine sender name
                            let senderName = isCurrentUser ? "You" : msg.sender?.name || "Unknown";

                            // Format timestamp
                            const formattedTime = msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                : "Unknown time";

                            return (
                                <div
                                    key={msg._id || index}
                                    style={{
                                        ...styles.messageContainer,
                                        ...(isCurrentUser ? styles.sentMessage : styles.receivedMessage)
                                    }}
                                >
                                    <div style={styles.senderName}>{senderName}</div>
                                    <div style={styles.messageContent}>
                                        {typeof msg.content === "string" ? msg.content : "[No valid message]"}
                                    </div>
                                    <div style={styles.timestamp}>{formattedTime}</div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default MessageList;
