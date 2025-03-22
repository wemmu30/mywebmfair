import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // ✅ ใช้ useNavigate
import { register } from "../../api";  // ✅ ใช้ API Utility
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Registrationform.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    username: "", 
    email: "",  
    password: "" 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);  // ✅ เพิ่มสถานะ Loading
  const navigate = useNavigate();

  // ✅ อัปเดตข้อมูลที่กรอก
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ อัปโหลดรูปภาพ
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ✅ ฟังก์ชันส่งข้อมูลสมัครสมาชิก
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);  // เริ่มโหลด
    const form = new FormData();
    form.append("name", formData.name);
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (selectedFile) {
      form.append("profileImage", selectedFile);
    }

    try {
      const response = await register(form);
      console.log("✅ Registration Success:", response);
      toast.success("Registered successfully!");
      
      setTimeout(() => {
        navigate("/login?registered=true");  // ✅ ใช้ useNavigate แทน window.location.href
      }, 1000);
    } catch (error) {
      console.error("❌ Registration Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);  // หยุดโหลด
    }
  };

  return (
    <section className="loginform">
      <div className="container-login">
        <div className="wrapper">
          <div className="heading-login">
            <h1>Sign Up</h1>
            <p>
              Already a user ?{" "}
              <span>
                <Link to="/login">Login here</Link>
              </span>
            </p>
          </div>
          <form onSubmit={handleRegister} className="form">
            <label className="label">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Email  
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              />
            </label>
            <label className="label">
              Profile Image
              <input
                type="file"
                onChange={handleFileChange}  
              />
            </label>
            <p className="forgot-pass">
              By signing up you agree to our{" "}
              <span>
                <Link to="/termsNconditions">terms & conditions</Link>
              </span>
            </p>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}  
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default RegistrationForm;
