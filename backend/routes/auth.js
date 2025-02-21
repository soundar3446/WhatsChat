const express = require("express");
const User = require("../models/Users");  // Use relative path
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();  // Load environment variables

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Signup API

const saltRounds = 10;

router.post("/signup", async (req, res) => {
    try {
        const { name, phoneNumber, password } = req.body;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, phoneNumber, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
});


router.post("/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Log request body

        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            console.log("Missing phoneNumber or password");
            return res.status(400).json({ error: "Phone number and password are required" });
        }

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            console.log("User not found for:", phoneNumber);
            return res.status(400).json({ error: "User not found" });
        }

        console.log("Stored password hash:", user.password);
        console.log("Entered password:", password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("Login successful for user:", user.phoneNumber);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        // ✅ Corrected response structure
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: "Login failed" });
    }
});



module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ Missing or malformed token in request header");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("🔍 Received token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verified successfully:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Invalid token:", error.message);
        return res.status(401).json({ error: "Invalid token" });
    }
};




module.exports = router;
