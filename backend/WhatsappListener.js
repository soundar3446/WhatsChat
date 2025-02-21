const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth'); // Use folder-based auth

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // Save authentication state
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;

        if (connection === 'open') {
            console.log('✅ WhatsApp Connected! Listening for messages...');
        } else if (connection === 'close') {
            console.log('🔌 Disconnected! Reconnecting...');
            startWhatsApp(); // Restart the connection
        }
    });

    // Listen for incoming messages
    sock.ev.on('messages.upsert', (messageUpdate) => {
        const message = messageUpdate.messages[0];
        if (!message || !message.message) return; // Ignore empty messages

        const sender = message.key.remoteJid;
        const text = message.message.conversation || 
                     message.message.extendedTextMessage?.text || 
                     '📝 Media message';

        console.log(`📩 New message from ${sender}: ${text}`);
    });
}

// Start the WhatsApp connection
startWhatsApp();
