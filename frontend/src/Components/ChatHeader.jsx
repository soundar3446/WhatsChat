import React from "react";

const ChatHeader = ({ recipient }) => {
    const getAlphabeticSum = (str) => {
        return str.toUpperCase().split('').reduce((sum, char) => {
            const charCode = char.charCodeAt(0);
            if (charCode >= 65 && charCode <= 90) {
                return sum + (charCode - 64); // A=1, B=2, ..., Z=26
            }
            return sum;
        }, 0);
    };

    const generateColorFromSum = (sum) => {
        const hue = sum % 360;
        const saturation = 60 + (sum % 40);
        const lightness = 40 + (sum % 20);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const getProfileIcon = (name) => {
        const firstLetter = name.charAt(0).toUpperCase();
        const sum = getAlphabeticSum(name);
        const profileColor = generateColorFromSum(sum);

        return (
            <div style={{ ...styles.profileIcon, backgroundColor: profileColor }}>
                {firstLetter}
            </div>
        );
    };

    const styles = {
        header: {
            width: "100%",
            height: "60px",
            backgroundColor: "#2f3136",
            background: "linear-gradient(90deg, #2f3136, #3a3c41)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "0 20px",
            fontSize: "18px",
            fontWeight: "600",
            borderBottom: "1px solid #444",
            boxSizing: "border-box",
            zIndex: 10,
            color: "#ffffff",
            transition: "background-color 0.3s ease, transform 0.3s ease",
        },
        avatarContainer: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "10px",
        },
        avatar: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        name: {
            fontSize: "16px",
            fontWeight: "500",
            color: "#f1f1f1",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            flexGrow: 1,
        },
        noRecipientText: {
            color: "#f1f1f1",
            fontStyle: "italic",
            fontSize: "16px",
        },
        profileIcon: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            fontSize: "20px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease, transform 0.3s ease",
        },
        hoverEffect: {
            "&:hover": {
                backgroundColor: "#40444b",
            },
        },
        headerHover: {
            "&:hover": {
                transform: "scale(1.05)",
            },
        },
    };

    return (
        <div style={styles.header} className="chat-header">
            {recipient ? (
                <>
                    {recipient.avatar ? (
                        <div style={styles.avatarContainer}>
                            <img
                                src={recipient.avatar}
                                alt={recipient.name || recipient.username}
                                style={styles.avatar}
                            />
                        </div>
                    ) : (
                        getProfileIcon(recipient.name || recipient.username)
                    )}
                    <div style={styles.name}>
                        {recipient.name || recipient.username}
                    </div>
                </>
            ) : (
                <div style={styles.noRecipientText}>
                    Select a recipient to start chatting
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
