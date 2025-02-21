const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { initializeWhatsAppClient } = require("./baileys/whatsappClient"); // ✅ Correct Import

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const app = express();
app.use(cors());
app.use(express.json());

// Use the auth and user routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Use the message routes for handling messages
app.use("/api/messages", messageRoutes);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/whatsapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Start WhatsApp Web connection only after it's properly imported
initializeWhatsAppClient();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
