const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

// สร้าง Schema สำหรับผู้ใช้
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  
  },
  password: {  
    type: String,        
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,  
    default: null,
  },
});

// เปรียบเทียบรหัสผ่านที่กรอกกับแฮชใน DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// สร้าง model สำหรับ User
const User = mongoose.model("User", userSchema);

module.exports = User;
