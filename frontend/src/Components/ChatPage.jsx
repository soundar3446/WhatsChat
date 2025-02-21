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
            backgroundColor: "white",
            color: "#000000",
            overflow: "hidden",
        },
        sidebar: {
            width: "280px",
            height: "100vh",
            backgroundColor: "#f5f5f5",
            boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
        },
        chatWindow: {
            flex: 1,
            height: "100vh",
            backgroundColor: "white",
        },
        authWarning: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "20px",
            borderRadius: "5px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        },
        authButton: {
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.authWarning}>
                    <h2>Authentication Required</h2>
                    <p>You must be logged in to access the chat. Please log in first.</p>
                    <button style={styles.authButton} onClick={() => window.location.href = "/login"}>
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
