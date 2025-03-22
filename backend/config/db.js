const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // เชื่อมต่อกับ MongoDB โดยใช้ MONGO_URI ที่ตั้งไว้ในไฟล์ .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // หยุดการทำงานของแอปถ้าการเชื่อมต่อไม่สำเร็จ
  }
};

module.exports = connectDB;
