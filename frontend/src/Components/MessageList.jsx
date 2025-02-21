import React, { useEffect, useRef, useState } from "react";

const MessageList = ({ messages, lastFetched }) => {
    const currentUserId = localStorage.getItem("userId");
    const messageEndRef = useRef(null);
    const [prevMessageCount, setPrevMessageCount] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);

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
            color: "#b9bbbe",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingBottom: "20px",
            scrollbarWidth: "thin",  // For Firefox
            scrollbarColor: "#7289DA #2C2F33",  // For Firefox (thumb color and track color)
        },
        messageContainer: {
            padding: "12px 15px",
            borderRadius: "20px",
            maxWidth: "70%",
            marginBottom: "12px",
            display: "inline-block",
            lineHeight: "1.5",
            wordBreak: "break-word",
        },
        sentMessage: {
            backgroundColor: "#7289DA",
            marginLeft: "auto",
            borderRadius: "20px 20px 0 20px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        },
        receivedMessage: {
            backgroundColor: "#40444b",
            borderRadius: "20px 20px 20px 0",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        },
        senderName: {
            fontWeight: "bold",
            marginBottom: "5px",
            color: "#ffffff",
            fontSize: "14px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
        },
        messageContent: {
            color: "#ffffff",
            fontSize: "16px",
        },
        timestamp: {
            fontSize: "11px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "5px",
            textAlign: "right",
            fontStyle: "italic",
        },
        noMessages: {
            textAlign: "center",
            color: "#b9bbbe",
            padding: "20px",
            fontStyle: "italic",
            fontSize: "16px",
        },
    };
    
    // Adding custom scrollbar styles for webkit browsers (Chrome, Safari, Edge)
    const customScrollbarStyles = `
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #7289DA;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
            background-color: #2C2F33;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #5a72b1;
        }
    `;

    // Scroll to the bottom only if new messages are added
    useEffect(() => {
        if (messages.length > prevMessageCount) {
            if (messageEndRef.current && !isInitialRender) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }
            setPrevMessageCount(messages.length);
            setIsInitialRender(false);
        }
    }, [messages, prevMessageCount, isInitialRender]);

    return (
        <div style={styles.container}>
            {messages.length === 0 ? (
                <p style={styles.noMessages}>No messages yet. Start the conversation!</p>
            ) : (
                messages
                    .filter(msg => msg.content && typeof msg.content === "string")
                    .map((msg, index) => {
                        const senderId = msg.sender?._id ? String(msg.sender._id) : String(msg.sender);
                        const isCurrentUser = senderId === currentUserId;

                        let senderName = isCurrentUser ? "You" : msg.sender?.name || "Unknown";
                        const formattedTime = msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Unknown time";

                        return (
                            <div
                                key={msg._id || index}
                                style={{
                                    ...styles.messageContainer,
                                    ...(isCurrentUser ? styles.sentMessage : styles.receivedMessage),
                                }}
                            >
                                <div style={styles.senderName}>{senderName}</div>
                                <div style={styles.messageContent}>{msg.content}</div>
                                <div style={styles.timestamp}>{formattedTime}</div>
                            </div>
                        );
                    })
            )}
            <div ref={messageEndRef}></div>
        </div>
    );
};

export default MessageList;
