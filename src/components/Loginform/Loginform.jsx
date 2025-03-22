import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./loginform.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

// ✅ ตั้งค่าให้ axios ส่ง Cookies ทุกครั้ง
axios.defaults.withCredentials = true; 

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Debug: ตรวจสอบว่ามี Cookies หรือไม่
    console.log("🔹 Existing Cookies:", document.cookie);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Debug: แสดงค่าที่กำลังส่งไป Backend
      console.log("🔹 Sending Data:", formData);

      const res = await axios.post("http://localhost:5002/api/auth/login", formData, {
        withCredentials: true,
      });

      console.log("🔹 Full Response from Backend:", res);
      console.log("🔹 Cookies (After Login):", document.cookie); // ✅ Debug: เช็ค cookies

      if (res.data.token && res.data.user) {
        // ✅ เก็บโทเค็นใน Cookies (ระบุ domain & secure ไว้ใช้ production)
        Cookies.set("token", res.data.token, { expires: 7, path: '/', secure: true });
        Cookies.set("isLoggedIn", "true", { expires: 7, path: '/' });
        Cookies.set("username", res.data.user.username, { expires: 7, path: '/' });
        Cookies.set("name", res.data.user.name || "", { expires: 7, path: '/' });
        Cookies.set("email", res.data.user.email || "", { expires: 7, path: '/' });
        Cookies.set("profileImage", res.data.user.profileImage || "", { expires: 7, path: '/' });

        toast.success("🎉 Login successful!");
        navigate("/profile"); 
      } else {
        toast.error("No token or user information received, something went wrong.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      console.error("❌ Error Response:", error.response?.data);

      const message = error.response?.data?.message || "Login failed, please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="loginform">
        <div className="container-login">
          <div className="wrapper">
            <div className="heading-login">
              <h1>Sign In</h1>
              <p>
                New User?{" "}
                <span>
                  <Link to="/registration">Create an account</Link>
                </span>
              </p>
            </div>
            <form onSubmit={handleLogin} className="form">
              <label className="label">
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </label>
              <label className="label">
                Password
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </label>
              <p className="forgot-pass">
                Forgot Password?{" "}
                <span>
                  <Link to="/forgot-password">Click here to reset</Link>
                </span>
              </p>
              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
