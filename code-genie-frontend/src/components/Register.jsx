import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import "../assets/styles/register.css";
import MainNav from "./MainNav";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    uname: "",
    password: "",
    cpassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    if (formData.password && formData.cpassword) {
      setPasswordMatch(formData.password === formData.cpassword);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, formData.cpassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => field === "")) {
      toast.error("Please fill in all fields", { autoClose: 1500 });
      return;
    }
    if (!passwordMatch) {
      toast.error("Passwords do not match", { autoClose: 1500 });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(response.data.message, { autoClose: 1500 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="register-container">
        <motion.div className="register-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <h2 className="title">Register to CodeGenie</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FaPhone className="icon" />
              <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" name="uname" placeholder="Username" value={formData.uname} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input type="password" name="cpassword" placeholder="Confirm Password" value={formData.cpassword} onChange={handleChange} required />
            </div>
            {passwordMatch === false && <p className="password-error">Passwords do not match</p>}
            {passwordMatch === true && <p className="password-success">Passwords match</p>}
            <motion.button whileHover={{ scale: 1.1 }} type="submit" className="register-btn">Register</motion.button>
          </form>
          <p className="login-link">Already have an account? <a href="/login">Login</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
