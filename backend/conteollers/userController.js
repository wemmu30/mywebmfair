const User = require("../models/User.js");

// ฟังก์ชันเพื่อดึงข้อมูลโปรไฟล์ของผู้ใช้
const getUserProfile = async (req, res) => {
  try {
    // ค้นหาผู้ใช้โดยใช้ userId จาก JWT token ที่ผ่าน middleware
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ส่งข้อมูลโปรไฟล์กลับไป
    res.json({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      username: user.username,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ฟังก์ชันเพื่ออัปเดตข้อมูลโปรไฟล์ของผู้ใช้
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, username } = req.body;
    const profileImage = req.file ? req.file.path : req.body.profileImage; // หากมีไฟล์ภาพโปรไฟล์อัปเดตใหม่

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, username, profileImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
