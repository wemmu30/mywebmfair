import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Profile from "../../components/Profile/Profile";

const API_BASE_URL = "http://localhost:5002";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
    password: "",
  });
  const navigate = useNavigate();

  // ✅ ดึงข้อมูลจาก Cookies และ API เมื่อโหลดหน้า
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const name = Cookies.get("name");
    const email = Cookies.get("email");
    const profileImage = Cookies.get("profileImage");

    if (name && email) {
      setUserData({
        name: name,
        email: email,
        profileImage: profileImage || "",
      });
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setUserData(res.data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        toast.error("Failed to load profile.");
      }
    };

    if (!name || !email) {
      fetchProfile();
    }
  }, [navigate]);

  return (
    <div className="profile-page">
      <Profile userData={userData} setUserData={setUserData} /> {/* ✅ ใช้ Profile Component */}
    </div>
  );
};

export default ProfilePage;
