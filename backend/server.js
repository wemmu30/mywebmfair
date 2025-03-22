const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes.js");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require('./config/db');
connectDB(); // เรียกใช้งานการเชื่อมต่อ MongoDB

const app = express();

app.use((req, res, next) => {
  console.log("Requested URL:", req.url);
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, path) {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", authRoutes); // ใช้ authRoutes ที่มี authMiddleware
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, or png images are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
})();

app.get("/", (req, res) => res.send("Server is running..."));
app.use("/api/auth", authRoutes);

app.post('/api/auth/register', upload.single('profileImage'), async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Username already exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    const newUser = new User({ name, email, username, password: hashedPassword, profileImage });
    await newUser.save();

    console.log("✅ User registered:", newUser);
    res.status(201).json({
      message: "User registered successfully",
      user: { name, email, profileImage }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));