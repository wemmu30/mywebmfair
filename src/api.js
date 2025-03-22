import axios from "axios";
import Cookies from "js-cookie";

// ✅ ตั้งค่า API Base URL
const API = axios.create({ baseURL: "http://localhost:5002" });

// ✅ ฟังก์ชัน Login
export const login = async (userData) => {
  try {
    const res = await API.post("/api/auth/login", userData);
    console.log("🔹 Login Response:", res.data);

    if (res.data.token && res.data.user) {
      // ✅ บันทึก Cookies (ตั้งค่า `path: '/'` เพื่อใช้ได้ทุกหน้า)
      Cookies.set("token", res.data.token, { expires: 7, path: '/' });
      Cookies.set("isLoggedIn", "true", { expires: 7, path: '/' });
      Cookies.set("username", res.data.user.username, { expires: 7, path: '/' });
      Cookies.set("name", res.data.user.name || "", { expires: 7, path: '/' });
      Cookies.set("profileImage", res.data.user.profileImage || "", { expires: 7, path: '/' });
    }

    return res.data;
  } catch (error) {
    console.error("❌ Login Error:", error);
    throw error;
  }
};

// ✅ ฟังก์ชัน Register
export const register = async (userData) => {
  try {
    const res = await API.post("/api/auth/register", userData);
    console.log("🔹 Register Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Register Error:", error);
    throw error;
  }
};

// ✅ ฟังก์ชันดึงข้อมูลโปรไฟล์
export const fetchProfileData = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("User is not logged in.");
  }

  try {
    const res = await API.get("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🔹 Profile Data:", res.data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("❌ Token expired or invalid. Please log in again.");
    }
    console.error("❌ Error fetching profile data:", error);
    throw error;
  }
};

// ✅ ฟังก์ชัน Logout (เคลียร์ Cookies)
export const logout = () => {
  Cookies.remove("token", { path: '/' });
  Cookies.remove("isLoggedIn", { path: '/' });
  Cookies.remove("username", { path: '/' });
  Cookies.remove("name", { path: '/' });
  Cookies.remove("profileImage", { path: '/' });
  console.log("✅ User logged out successfully!");
};
