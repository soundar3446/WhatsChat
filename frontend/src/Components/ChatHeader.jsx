import React from "react";

const ChatHeader = ({ recipient }) => {
    const styles = {
        header: {
            width: "100%",
            height: "60px",
            backgroundColor: "#23272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            fontSize: "18px",
            fontWeight: "bold",
            borderBottom: "1px solid #444",
            boxSizing: "border-box",
            zIndex: 10, 
            color: "white",
        }
    };

    return (
        <div style={styles.header}>
            {recipient ? recipient.name || recipient.username || "Unnamed User" : "No Chat Selected"}
        </div>
    );
};

export default ChatHeader;
