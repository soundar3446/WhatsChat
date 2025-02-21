import React, { useState, useEffect } from "react";

const Sidebar = ({ onSelectRecipient }) => {
    const [recipients, setRecipients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRecipient, setNewRecipient] = useState({ phoneNumber: "", username: "" });
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        fetchRecipients();
    }, []);

    const fetchRecipients = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found, user must log in.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/recipients", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Corrected template literal
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Failed to fetch recipients:", errorData);
                return;
            }

            const data = await response.json();
            setRecipients(data.recipients);
        } catch (error) {
            console.error("❌ Network error while fetching recipients:", error);
        }
    };

    const handleAddRecipient = async () => {
        if (!newRecipient.phoneNumber || !newRecipient.username) {
            alert("Please enter both username and phone number.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:5000/api/add-recipients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // Corrected template literal
                },
                body: JSON.stringify(newRecipient)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

            alert("Recipient added successfully!");
            setShowModal(false);
            setNewRecipient({ phoneNumber: "", username: "" });
            fetchRecipients(); // Refresh recipient list
        } catch (error) {
            console.error("Error adding recipient:", error.message);
        }
    };

    const styles = {
        sidebar: {
            width: "280px",
            height: "100vh",
            backgroundColor: "#2C2F33",
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: "15px",
            position: "fixed",
            top: 0,
            left: 0,
        },
        header: { 
            fontSize: "22px", 
            fontWeight: "bold", 
            textAlign: "center", 
            padding: "10px",
            backgroundColor: "#23272A",
            borderRadius: "5px",
            flexShrink: 0,
        },
        recipientContainer: { 
            flex: 1, // Makes the recipient list take remaining space
            overflowY: "auto", 
            scrollbarWidth: "thin",
            marginBottom: "10px",
        },
        recipientItem: { 
            padding: "12px", 
            cursor: "pointer", 
            borderBottom: "1px solid #444", 
            borderRadius: "5px",
            transition: "background 0.2s",
            fontSize: "16px",
        },
        recipientItemHover: { backgroundColor: "#3A3E42" },
        addButtonContainer: {
            display: "flex",
            justifyContent: "center",
            padding: "10px 0",
        },
        addButton: {
            backgroundColor: "#7289DA",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "90%",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
        },
        modalOverlay: {
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000, // Set z-index high to ensure it’s above other elements
        },
        modal: {
            backgroundColor: "#36393F",
            padding: "25px",
            borderRadius: "10px",
            textAlign: "center",
            color: "white",
            width: "320px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            zIndex: 1001, // Make sure modal itself has a higher z-index than the overlay
        },
        input: { 
            width: "100%", 
            padding: "12px", 
            marginBottom: "12px", 
            borderRadius: "6px", 
            border: "none",
            fontSize: "16px",
            backgroundColor: "#2C2F33",
            color: "white"
        },
        modalButton: { 
            backgroundColor: "#7289DA", 
            padding: "12px", 
            borderRadius: "8px", 
            border: "none", 
            color: "white", 
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
        }
    };
    

    return (
        <>
            <div style={styles.sidebar}>
                <div style={styles.header}>Chats</div>

                <div style={styles.recipientContainer}>
                    {recipients.length > 0 ? recipients.map((r, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                ...styles.recipientItem, 
                                ...(hoveredIndex === index && styles.recipientItemHover) 
                            }} 
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onSelectRecipient(r)}
                        >
                            {r.name || "Unnamed User"}
                        </div>
                    )) : <p style={{ textAlign: "center", padding: "10px" }}>No recipients</p>}
                </div>

                {/* Button Container - Keeps it at the bottom */}
                <div style={styles.addButtonContainer}>
                    <button style={styles.addButton} onClick={() => setShowModal(true)}>
                        ➕ Add Recipient
                    </button>
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Add Recipient</h3>
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            style={styles.input} 
                            value={newRecipient.username} 
                            onChange={(e) => setNewRecipient({ ...newRecipient, username: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Enter phone number" 
                            style={styles.input} 
                            value={newRecipient.phoneNumber} 
                            onChange={(e) => setNewRecipient({ ...newRecipient, phoneNumber: e.target.value })} 
                        />
                        <button style={styles.modalButton} onClick={handleAddRecipient}>Add</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
