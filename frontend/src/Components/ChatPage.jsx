import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        setIsAuthenticated(!!(token && userId));
    }, []);

    const styles = {
        container: {
            display: "flex",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#f4f7fa",
            color: "#333",
            overflow: "hidden",
        },
        sidebar: {
            width: "280px",
            height: "100vh",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
        },
        chatWindow: {
            flex: 1,
            height: "100vh",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
        },
        authWarning: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            width: "80%",
            maxWidth: "400px",
        },
        authButton: {
            padding: "12px 18px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "15px",
            transition: "background-color 0.3s ease",
        },
        authButtonHover: {
            backgroundColor: "#0056b3",
        },
    };

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = styles.authButtonHover.backgroundColor;
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = styles.authButton.backgroundColor;
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.authWarning}>
                    <h2>Authentication Required</h2>
                    <p>You must be logged in to access the chat. Please log in first.</p>
                    <button
                        style={styles.authButton}
                        onClick={() => window.location.href = "/login"}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <Sidebar onSelectRecipient={setSelectedRecipient} />
            </div>
            <div style={styles.chatWindow}>
                <ChatWindow recipient={selectedRecipient} />
            </div>
        </div>
    );
};

export default ChatPage;
