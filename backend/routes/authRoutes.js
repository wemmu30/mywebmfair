const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ตั้งค่า multer สำหรับการอัปโหลดไฟล์
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // รองรับไฟล์ .jpeg, .jpg, .png เท่านั้น
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, or png images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // จำกัดขนาดไฟล์ไม่เกิน 5MB
  fileFilter: fileFilter  // ตรวจสอบประเภทไฟล์
});

// Register Route
router.post("/register", upload.single("profileImage"), async (req, res) => {
  console.log("Received registration data:", req.body);

  try {
    const { name, username, email, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password (During Register):", hashedPassword); // เพิ่มการแสดงผลรหัสผ่านที่แฮชแล้ว
    const newUser = new User({ name, username, email, password: hashedPassword, profileImage });
    await newUser.save();

    console.log("User saved in MongoDB:", newUser);
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide both username and password" });
    }

    console.log("🔹 Login Attempt - Username:", username, "Password:", password);

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ลบช่องว่างในรหัสผ่าน
    const trimmedPassword = password.trim();

    console.log("🔹 Username:", user.username);
    console.log("🔹 Password from input:", trimmedPassword);
    console.log("🔹 Hashed password from DB:", user.password);

    // เปรียบเทียบรหัสผ่านที่กรอกกับแฮชที่เก็บในฐานข้อมูล
    const isMatch = await user.matchPassword(trimmedPassword);
    console.log("🔎 Password Match Status:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const authMiddleware = require('../middleware/authMiddleware'); // นำเข้า middleware

   // Route สำหรับดึงข้อมูลโปรไฟล์ของผู้ใช้
    router.get('/profile', authMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.userId); // ใช้ userId จาก token
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // ส่งข้อมูลโปรไฟล์กลับ
        res.json({
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        });
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ message: "Failed to fetch profile" });
      }
    });

    // สร้าง JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token Generated:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ใช้ `true` ถ้ารันบน HTTPS
      sameSite: "Lax",
      maxAge: 3600000, // 1 ชั่วโมง
    });

    return res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      } 
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
    router.post("/logout", (req, res) => {
      res.clearCookie("token", { path: "/" });
      res.json({ message: "Logout successful" });
    });

module.exports = router;
