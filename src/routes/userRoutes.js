const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth"); // ✅ Corrected import path

// Admin Register
router.post("/admin/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = new User({ name, email, password: hashedPassword, role: "admin" });
        await adminUser.save();

        const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            token,
            user: {
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminUser = await User.findOne({ email, role: "admin" });
        if (!adminUser) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            token,
            user: {
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword, role: "user" });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            redirect: "/home"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Home - User Route
router.get("/home", auth, (req, res) => {
    try {
        res.render("home", { user: req.user });
    } catch (err) {
        res.status(500).send("Error rendering home");
    }
});

// Admin Dashboard Route
router.get("/admin/dashboard", auth, (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        res.render("admin/dashboard", { user: req.user });
    } catch (err) {
        res.status(500).send("Error rendering dashboard");
    }
});

module.exports = router;






