import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import "./Profile.css";

const API_BASE_URL = "http://localhost:5002";

const Profile = ({ userData, setUserData }) => {
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("You're not logged in.");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching user profile with token:", token); // Debugging Token
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", res.data); // Debugging API Response

        if (res.data) {
          setUserData({
            name: res.data.name,
            email: res.data.email,
            profileImage: res.data.profileImage
              ? `${API_BASE_URL}/uploads/${res.data.profileImage}`
              : "",
          });

          setPreviewImage(
            res.data.profileImage ? `${API_BASE_URL}/uploads/${res.data.profileImage}` : ""
          );

          console.log("Updated userData:", {
            name: res.data.name,
            email: res.data.email,
            profileImage: res.data.profileImage
              ? `${API_BASE_URL}/uploads/${res.data.profileImage}`
              : "",
          }); // Debugging Updated State
        } else {
          console.error("❌ No data received from API");
          toast.error("Failed to load profile.");
        }
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error.response || error.message);
        toast.error("Failed to load profile.");
      }
    };

    fetchUserProfile();
  }, [navigate, setUserData]);

  useEffect(() => {
    console.log("Current userData:", userData); // Debugging userData
  }, [userData]);

  useEffect(() => {
    if (userData.profileImage && !(userData.profileImage instanceof File)) {
      setPreviewImage(userData.profileImage);
    }
  }, [userData.profileImage]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You're not logged in.");
      return navigate("/login");
    }

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.password) formData.append("password", userData.password);
      if (userData.profileImage instanceof File) {
        formData.append("profileImage", userData.profileImage);
      }

      const res = await axios.post(`${API_BASE_URL}/api/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const profileImageURL = res.data.profileImage
        ? `${API_BASE_URL}/uploads/${res.data.profileImage}`
        : previewImage || "";

      Cookies.set("profileImage", profileImageURL, { expires: 7, path: "/" });
      Cookies.set("name", res.data.name, { expires: 7, path: "/" });
      Cookies.set("email", res.data.email, { expires: 7, path: "/" });

      setUserData({
        name: res.data.name,
        email: res.data.email,
        profileImage: profileImageURL,
      });

      setPreviewImage(profileImageURL);

      toast.success("🎉 Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Edit Your Profile</h1>
      {userData ? (
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={userData.name || ""} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={userData.email || ""} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={userData.password || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" name="profileImage" onChange={handleFileChange} accept="image/*" />
          </div>
          {previewImage && (
            <div className="profile-image-preview">
              <img src={previewImage} alt="Profile Preview" />
            </div>
          )}
          <button type="submit" className="submit-btn">Save Changes</button>
        </form>
      ) : (
        <p>Loading profile...</p> // เพิ่มข้อความแสดงสถานะการโหลด
      )}
    </div>
  );
};

export default Profile;