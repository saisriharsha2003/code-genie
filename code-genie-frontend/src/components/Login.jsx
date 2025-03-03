import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "./MainNav";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import "../assets/styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ uname: "", password: "", cpassword: "" });
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.uname || !formData.password || !formData.cpassword) {
      toast.error("Fill all details properly", { autoClose: 1500 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, formData, { headers: { "Content-Type": "application/json" } });
      toast.success(response.data.message, { autoClose: 1500 });
      if (response.status === 200) {
        const { name, uname } = response.data;

        localStorage.setItem("name", name);
        localStorage.setItem("username", uname);

        toast.success("Redirecting to Home...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.Error || "Something went wrong.", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MainNav />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="login-container">
        <motion.div className="login-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <h2 className="title">Login to CodeGenie</h2>
          <form onSubmit={handleSubmit} className="login-form">
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
            <motion.button whileHover={{ scale: 1.1 }} type="submit" className="login-btn">Login</motion.button>
          </form>
          <p className="signup-link">Don't have an account? <a href="/register">Register</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
