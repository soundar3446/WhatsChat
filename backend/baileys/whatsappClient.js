const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

let whatsappClient; // Store the client instance globally

// Initialize and start the WhatsApp client
const initializeWhatsAppClient = async () => {
    const { state, saveCreds } = await useMultiFileAuthState("baileys_auth");

    whatsappClient = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Show QR code in terminal for login
    });

    // Listen for authentication updates
    whatsappClient.ev.on("creds.update", saveCreds);

    // Handle disconnections & reconnections
    whatsappClient.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "close") {
            console.log("🔴 WhatsApp connection closed. Reconnecting...");
            initializeWhatsAppClient(); // Restart on disconnect
        } else if (connection === "open") {
            console.log("✅ WhatsApp connected!");
        }
    });

    return whatsappClient;
};

// ✅ Updated Function to Send WhatsApp Messages
const sendWhatsAppMessage = async (sender, receiver, message) => {
    if (!whatsappClient) throw new Error("❌ WhatsApp client not initialized");

    // Ensure sender & receiver numbers are properly formatted
    const senderNumber = sender.trim();
    const receiverNumber = receiver.trim();

    console.log(`📩 Sending WhatsApp message from ${senderNumber} to ${receiverNumber}: "${message}"`);

    await whatsappClient.sendMessage(`${receiverNumber}@s.whatsapp.net`, { text: message });
    console.log(`✅ Message successfully sent to ${receiverNumber}`);
};

// Export both functions
module.exports = { initializeWhatsAppClient, sendWhatsAppMessage };
